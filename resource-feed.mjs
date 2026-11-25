const categories = ['video','article','devotional','resource'];
export function safeResources(payload,category='') {
  if(!Array.isArray(payload?.resources)||payload.resources.length>200)return [];
  return payload.resources.filter(row=>{
    if(!row||!categories.includes(row.category)||(category&&row.category!==category))return false;
    if(typeof row.title!=='string'||!row.title.trim()||row.title.length>140||
      typeof row.description!=='string'||row.description.length>1000||
      typeof row.url!=='string'||row.url.length>2000)return false;
    try {
      const url=new URL(row.url);
      return url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&url.hostname.includes('.');
    }catch{return false;}
  }).sort((a,b)=>(Number(b.publishedAt)||0)-(Number(a.publishedAt)||0));
}
export function renderResources(container,resources,doc=container.ownerDocument) {
  const items=resources.map(row=>{
    const link=doc.createElement('a');
    link.className='room-link';
    link.href=row.url;
    link.target='_blank';
    link.rel='noopener noreferrer';
    const title=doc.createElement('h3');
    title.textContent=row.title;
    link.append(title);
    if(row.description) {
      const description=doc.createElement('p');
      description.className='muted';
      description.textContent=row.description;
      link.append(description);
    }
    return link;
  });
  container.replaceChildren(...items);
}
export async function loadResources(doc=document,fetcher=fetch) {
  const sections=[...doc.querySelectorAll('[data-vgm-resources]')];
  if(!sections.length)return;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  try {
    const response=await fetcher('https://discipleship.valiantguardianministries.org/api/vgm-public-resources',{
      credentials:'omit',referrerPolicy:'no-referrer',mode:'cors',signal:controller.signal,
    });
    if(!response.ok)return;
    const payload=await response.json();
    for(const section of sections) {
      const container=section.querySelector('[data-vgm-resource-items]');
      if(!container)continue;
      const rows=safeResources(payload,section.dataset.vgmCategory??'');
      renderResources(container,rows,doc);
      section.hidden=rows.length===0;
    }
  } catch {
    // Existing website resources remain available if the feed cannot load.
  } finally {clearTimeout(timer);}
}
if(typeof document!=='undefined')loadResources();
