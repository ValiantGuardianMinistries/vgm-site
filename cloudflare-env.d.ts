declare namespace Cloudflare {
 interface Env {
  DB?:D1Database; BUCKET?:R2Bucket; ASSETS?:Fetcher;
  CF_ACCESS_TEAM_DOMAIN?:string; CF_ACCESS_AUD?:string; ADMIN_EMAILS?:string;
 }
}
