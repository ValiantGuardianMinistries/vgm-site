import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import MarkdownIt from "markdown-it";

const rootDir = process.cwd();
const contentDir = path.join(rootDir, "content");
const siteUrl = "https://vgm-site.pages.dev";
const defaultAuthor = "Valiant Guardian Ministries";
const articleSource = path.join(contentDir, "articles");
const devotionalSource = path.join(contentDir, "devotionals");

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
});

const devotionalCategories = [
  {
    name: "Law",
    books: ["Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy"]
  },
  {
    name: "History",
    books: ["Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther"]
  },
  {
    name: "Wisdom",
    books: ["Job", "Psalms", "Proverbs", "Ecclesiastes", "Song of Solomon"]
  },
  {
    name: "Prophets",
    books: ["Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"]
  },
  {
    name: "Gospels",
    books: ["Matthew", "Mark", "Luke", "John"]
  },
  {
    name: "Epistles",
    books: ["Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"]
  }
];

const categoryLookup = new Map(
  devotionalCategories.map((category, categoryIndex) => [
    category.name,
    {
      categoryIndex,
      books: new Map(category.books.map((book, bookIndex) => [book, bookIndex]))
    }
  ])
);

await rebuildDist();

async function rebuildDist() {
  await fs.rm(path.join(rootDir, "articles"), { recursive: true, force: true });
  await fs.rm(path.join(rootDir, "devotionals"), { recursive: true, force: true });

  const articles = await loadContentCollection("article", articleSource);
  const devotionals = await loadContentCollection("devotional", devotionalSource);

  await writeText(path.join(rootDir, "forge-articles.html"), renderArticlesPage(articles));
  await writeText(path.join(rootDir, "forge-devotionals.html"), renderDevotionalsPage(devotionals));

  for (const article of articles) {
    await writeText(path.join(rootDir, "articles", article.slug, "index.html"), renderDetailPage(article));
  }

  for (const devotional of devotionals) {
    await writeText(path.join(rootDir, "devotionals", devotional.slug, "index.html"), renderDetailPage(devotional));
  }

  await writeText(path.join(rootDir, "sitemap.xml"), renderSitemap(articles, devotionals));
}

async function loadContentCollection(kind, directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) {
      continue;
    }

    const sourcePath = path.join(directory, entry.name);
    const source = await fs.readFile(sourcePath, "utf8");
    const parsed = matter(source);
    const item = normalizeContentItem({
      kind,
      fileName: entry.name,
      sourcePath,
      data: parsed.data,
      body: parsed.content
    });

    items.push(item);
  }

  if (kind === "article") {
    items.sort((left, right) => left.title.localeCompare(right.title));
  } else {
    items.sort(compareDevotionals);
  }

  return items;
}

function normalizeContentItem({ kind, fileName, sourcePath, data, body }) {
  const title = cleanString(data.title) || fileName.replace(/\.md$/, "");
  const slug = slugify(cleanString(data.slug) || title);
  const author = cleanString(data.author) || defaultAuthor;
  const bodyYouTube = extractYouTubeUrl(body);
  const frontmatterYouTube = cleanString(data.youtube);
  const youtubeUrl = frontmatterYouTube || bodyYouTube || "";
  const videoId = extractYouTubeId(youtubeUrl);
  const description = cleanString(data.description) || buildExcerpt(body);
  const date = cleanString(data.date);
  const contentWithoutEmbeddedLink = videoId ? stripYouTubeLinks(body) : body;
  const renderedBody = markdown.render(contentWithoutEmbeddedLink.trim());

  if (!date) {
    console.warn(`[content warning] Missing date in ${path.relative(rootDir, sourcePath)}`);
  }

  const item = {
    kind,
    title,
    slug,
    author,
    description,
    date,
    featured: Boolean(data.featured),
    youtubeUrl,
    videoId,
    body: contentWithoutEmbeddedLink,
    renderedBody,
    sourcePath,
    canonicalUrl: `${siteUrl}/${kind === "article" ? "articles" : "devotionals"}/${slug}/`,
    pagePath: `${kind === "article" ? "articles" : "devotionals"}/${slug}/`
  };

  if (kind === "devotional") {
    item.category = cleanString(data.category);
    item.book = cleanString(data.book);
    item.chapter = normalizeChapter(data.chapter);

    if (!item.category || !categoryLookup.has(item.category)) {
      throw new Error(`Invalid or missing devotional category in ${sourcePath}`);
    }

    const categoryInfo = categoryLookup.get(item.category);
    if (!item.book || !categoryInfo.books.has(item.book)) {
      throw new Error(`Invalid or missing devotional book in ${sourcePath}`);
    }

    if (item.chapter === null) {
      throw new Error(`Invalid or missing devotional chapter in ${sourcePath}`);
    }
  }

  return item;
}

function compareDevotionals(left, right) {
  const leftCategory = categoryLookup.get(left.category);
  const rightCategory = categoryLookup.get(right.category);

  if (leftCategory.categoryIndex !== rightCategory.categoryIndex) {
    return leftCategory.categoryIndex - rightCategory.categoryIndex;
  }

  const leftBookIndex = leftCategory.books.get(left.book);
  const rightBookIndex = rightCategory.books.get(right.book);

  if (leftBookIndex !== rightBookIndex) {
    return leftBookIndex - rightBookIndex;
  }

  return left.chapter - right.chapter;
}

function renderArticlesPage(articles) {
  const cards = articles.length
    ? articles.map((article) => renderArticleCard(article)).join("\n")
    : `<p class="muted content-empty">No articles have been published yet.</p>`;

  return renderPageShell({
    title: "Forge Articles | Valiant Guardian Ministries",
    description: "Browse article resources from Valiant Guardian Ministries for discipleship, Scripture study, and faithful living.",
    canonicalPath: "/forge-articles.html",
    pageType: "CollectionPage",
    bodyClass: "room-forge",
    breadcrumbName: "Articles",
    breadcrumbPath: "/forge-articles.html",
    mainContent: `
      <header class="room-top">
        <div class="top-nav">
          <a href="forge.html">← Forge</a>
          <a href="index.html">The Haven</a>
        </div>
      </header>

      <section class="entry">
        <h1>Forge — Articles</h1>
        <p class="muted">Written resources for deeper study, discipleship, and faithful reflection.</p>
      </section>

      <section class="zone">
        <div class="content-section-head">
          <div>
            <h2>Articles</h2>
            <p class="muted">Listed alphabetically for easy browsing.</p>
          </div>
        </div>
        <div class="content-card-grid">
          ${cards}
        </div>
      </section>
    `
  });
}

function renderDevotionalsPage(devotionals) {
  const categoryButtons = devotionalCategories.map((category, index) => {
    const count = devotionals.filter((item) => item.category === category.name).length;
    return `
      <button class="devo-chip" type="button" data-devo-category="${escapeHtml(category.name)}" aria-pressed="${index === 0 ? "true" : "false"}">
        <span class="devo-chip-index">${index + 1}.</span>
        <span>${escapeHtml(category.name)}</span>
        <span class="devo-chip-count">${count}</span>
      </button>
    `;
  }).join("\n");

  const bookPanels = devotionalCategories.map((category, categoryIndex) => {
    const books = category.books
      .map((book, bookIndex) => {
        const matching = devotionals.filter((item) => item.category === category.name && item.book === book);
        if (!matching.length) {
          return "";
        }

        return `
          <button class="devo-book-btn" type="button" data-devo-book="${escapeHtml(book)}" data-devo-category-parent="${escapeHtml(category.name)}" aria-pressed="${categoryIndex === 0 && bookIndex === 0 ? "true" : "false"}">
            ${escapeHtml(book)}
          </button>
        `;
      })
      .filter(Boolean)
      .join("\n");

    return `
      <section class="devo-books-panel${categoryIndex === 0 ? " is-active" : ""}" data-devo-books-panel="${escapeHtml(category.name)}"${categoryIndex === 0 ? "" : " hidden"}>
        <div class="content-section-head">
          <div>
            <h2>${escapeHtml(category.name)}</h2>
            <p class="muted">Choose a book to view available chapters.</p>
          </div>
        </div>
        <div class="devo-book-grid">
          ${books || `<p class="muted content-empty">No devotionals are published in this category yet.</p>`}
        </div>
      </section>
    `;
  }).join("\n");

  const chapterPanels = devotionalCategories.map((category, categoryIndex) => {
    return category.books.map((book, bookIndex) => {
      const chapters = devotionals
        .filter((item) => item.category === category.name && item.book === book)
        .map((item) => `
          <a class="devo-chapter-link" href="${item.pagePath}">
            <span class="devo-chapter-number">${item.chapter}</span>
            <span class="devo-chapter-meta">
              <strong>${escapeHtml(item.title)}</strong>
              <span>${escapeHtml(item.description)}</span>
            </span>
          </a>
        `)
        .join("\n");

      if (!chapters) {
        return "";
      }

      const isDefault = categoryIndex === 0 && bookIndex === 0;

      return `
        <section class="devo-chapters-panel${isDefault ? " is-active" : ""}" data-devo-chapters-panel="${escapeHtml(book)}"${isDefault ? "" : " hidden"}>
          <div class="content-section-head">
            <div>
              <h2>${escapeHtml(book)}</h2>
              <p class="muted">Select a chapter to open the devotional.</p>
            </div>
          </div>
          <div class="devo-chapter-grid">
            ${chapters}
          </div>
        </section>
      `;
    }).join("\n");
  }).join("\n");

  return renderPageShell({
    title: "Forge Devotionals | Valiant Guardian Ministries",
    description: "Browse Scripture-centered devotionals from Valiant Guardian Ministries by category, book, and chapter.",
    canonicalPath: "/forge-devotionals.html",
    pageType: "CollectionPage",
    bodyClass: "room-forge",
    breadcrumbName: "Devotionals",
    breadcrumbPath: "/forge-devotionals.html",
    mainContent: `
      <header class="room-top">
        <div class="top-nav">
          <a href="forge.html">← Forge</a>
          <a href="index.html">The Haven</a>
        </div>
      </header>

      <section class="entry">
        <h1>Forge — Devotionals</h1>
        <p class="muted">Scripture-centered devotionals arranged by category, book, and chapter.</p>
      </section>

      <div class="devo-browser" data-devo-browser>
        <section class="zone">
          <div class="content-section-head">
            <div>
              <h2>Categories</h2>
              <p class="muted">Begin with the portion of Scripture you want to explore.</p>
            </div>
          </div>
          <div class="devo-category-grid">
            ${categoryButtons}
          </div>
        </section>

        <section class="zone">
          ${bookPanels}
        </section>

        <section class="zone">
          ${chapterPanels}
        </section>
      </div>
    `
  });
}

function renderDetailPage(item) {
  const detailType = item.kind === "article" ? "Article" : "Devotional";
  const backLink = item.kind === "article" ? "forge-articles.html" : "forge-devotionals.html";
  const metaBits = [
    detailType,
    item.kind === "devotional" ? `${item.category} • ${item.book} ${item.chapter}` : null,
    item.date || "Date pending",
    item.author
  ].filter(Boolean);

  const videoBlock = item.videoId
    ? `
      <section class="content-video">
        <div class="video">
          <iframe
            src="https://www.youtube.com/embed/${item.videoId}?rel=0"
            title="${escapeHtml(item.title)} video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </section>
    `
    : "";

  const schemaType = item.kind === "article" ? "Article" : "BlogPosting";
  const schemaDate = item.date ? `"datePublished": "${item.date}",` : "";

  return renderPageShell({
    title: `${item.title} | Valiant Guardian Ministries`,
    description: item.description,
    canonicalPath: `/${item.pagePath}`,
    pageType: schemaType,
    bodyClass: "room-forge",
    breadcrumbName: item.title,
    breadcrumbPath: `/${item.pagePath}`,
    extraHead: `
      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "${schemaType}",
          "headline": ${JSON.stringify(item.title)},
          ${schemaDate}
          "author": {
            "@type": "Organization",
            "name": ${JSON.stringify(item.author)}
          },
          "publisher": {
            "@type": "Organization",
            "name": "Valiant Guardian Ministries",
            "logo": {
              "@type": "ImageObject",
              "url": "${siteUrl}/logo.png"
            }
          },
          "description": ${JSON.stringify(item.description)},
          "mainEntityOfPage": ${JSON.stringify(item.canonicalUrl)}
        }
      </script>
    `,
    mainContent: `
      <header class="room-top">
        <div class="top-nav">
          <a href="../../${backLink}">← ${item.kind === "article" ? "Articles" : "Devotionals"}</a>
          <a href="../../forge.html">Forge</a>
          <a href="../../index.html">The Haven</a>
        </div>
      </header>

      <article class="zone content-detail">
        <div class="content-section-head">
          <div>
            <p class="content-kicker">${detailType}</p>
            <h1>${escapeHtml(item.title)}</h1>
            <p class="muted content-meta">${escapeHtml(metaBits.join(" • "))}</p>
          </div>
        </div>
        <p class="content-description">${escapeHtml(item.description)}</p>
        ${videoBlock}
        <div class="content-body">
          ${item.renderedBody}
        </div>
      </article>
    `
  });
}

function renderArticleCard(article) {
  return `
    <article class="tile content-card">
      <p class="content-card-kicker">Article</p>
      <h3>${escapeHtml(article.title)}</h3>
      <p>${escapeHtml(article.description)}</p>
      <p class="muted content-card-meta">${escapeHtml(article.author)}${article.date ? ` • ${escapeHtml(article.date)}` : ""}</p>
      <div class="vgm-card-actions">
        <a class="btn" href="${article.pagePath}">Read Article</a>
      </div>
    </article>
  `;
}

function renderSitemap(articles, devotionals) {
  const staticPages = [
    "",
    "/oath.html",
    "/offering.html",
    "/forge.html",
    "/forge-videos.html",
    "/videos-vgm.html",
    "/videos-theology.html",
    "/videos-jv.html",
    "/forge-articles.html",
    "/forge-devotionals.html",
    "/training-ground.html",
    "/armory.html"
  ];

  const urls = [
    ...staticPages.map((item) => `${siteUrl}${item}`),
    ...articles.map((item) => `${siteUrl}/${item.pagePath}`),
    ...devotionals.map((item) => `${siteUrl}/${item.pagePath}`)
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>\n    <loc>${escapeHtml(url)}</loc>\n  </url>`).join("\n")}
</urlset>
`;
}

function renderPageShell({ title, description, canonicalPath, pageType, bodyClass, breadcrumbName, breadcrumbPath, mainContent, extraHead = "" }) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}">
  <meta property="og:locale" content="en_US">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Valiant Guardian Ministries">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}">
  <meta property="og:image" content="${siteUrl}/logo.png">
  <meta property="og:image:alt" content="Valiant Guardian Ministries logo">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${siteUrl}/logo.png">
  <meta name="theme-color" content="#090d13">
  <link rel="icon" href="${canonicalPath.includes("/articles/") || canonicalPath.includes("/devotionals/") ? "../../logo.png" : "logo.png"}" type="image/png">
  <link rel="apple-touch-icon" sizes="180x180" href="${canonicalPath.includes("/articles/") || canonicalPath.includes("/devotionals/") ? "../../apple-touch-icon.png" : "/apple-touch-icon.png"}">
  <link rel="manifest" href="${canonicalPath.includes("/articles/") || canonicalPath.includes("/devotionals/") ? "../../site.webmanifest" : "/site.webmanifest"}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Source+Serif+4:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${canonicalPath.includes("/articles/") || canonicalPath.includes("/devotionals/") ? "../../haven.css" : "haven.css"}">
  <script src="${canonicalPath.includes("/articles/") || canonicalPath.includes("/devotionals/") ? "../../haven.js" : "haven.js"}" defer></script>
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "${siteUrl}/#organization",
          "name": "Valiant Guardian Ministries",
          "url": "${siteUrl}/",
          "logo": "${siteUrl}/logo.png"
        },
        {
          "@type": "WebSite",
          "@id": "${siteUrl}/#website",
          "url": "${siteUrl}/",
          "name": "Valiant Guardian Ministries",
          "publisher": {
            "@id": "${siteUrl}/#organization"
          }
        },
        {
          "@type": "${pageType}",
          "@id": "${canonicalUrl}#webpage",
          "url": "${canonicalUrl}",
          "name": ${JSON.stringify(title.replace(" | Valiant Guardian Ministries", ""))},
          "description": ${JSON.stringify(description)},
          "isPartOf": {
            "@id": "${siteUrl}/#website"
          },
          "about": {
            "@id": "${siteUrl}/#organization"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "The Haven",
              "item": "${siteUrl}/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "The Forge",
              "item": "${siteUrl}/forge.html"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": ${JSON.stringify(breadcrumbName)},
              "item": "${siteUrl}${breadcrumbPath}"
            }
          ]
        }
      ]
    }
  </script>
  ${extraHead}
</head>
<body class="${bodyClass}">
  <main class="site-shell">
    ${mainContent}
  </main>
</body>
</html>
`;
}

function cleanString(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "";
}

function normalizeChapter(value) {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }

  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return Number(value.trim());
  }

  return null;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildExcerpt(body) {
  const excerpt = body
    .replace(/\[[^\]]+\]\([^)]+\)/g, "$1")
    .replace(/[#>*_`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return excerpt.slice(0, 155).trim() || "Read this resource from Valiant Guardian Ministries.";
}

function stripYouTubeLinks(body) {
  return body
    .split(/\r?\n/)
    .filter((line) => !extractYouTubeId(line.trim()))
    .join("\n");
}

function extractYouTubeUrl(body) {
  const match = body.match(/https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]{11}(?:[^\s)]*)?|youtu\.be\/[\w-]{11}(?:[^\s)]*)?|youtube\.com\/embed\/[\w-]{11}(?:[^\s)]*)?)/i);
  return match ? match[0] : "";
}

function extractYouTubeId(input) {
  if (!input) {
    return "";
  }

  try {
    const url = new URL(input);

    if (url.hostname === "youtu.be") {
      const id = url.pathname.replace(/\//g, "").slice(0, 11);
      return /^[\w-]{11}$/.test(id) ? id : "";
    }

    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname === "/watch") {
        const id = url.searchParams.get("v") || "";
        return /^[\w-]{11}$/.test(id) ? id : "";
      }

      if (url.pathname.startsWith("/embed/")) {
        const id = url.pathname.split("/")[2] || "";
        return /^[\w-]{11}$/.test(id) ? id : "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function writeText(filePath, content) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, "utf8");
}
