import {readFile,writeFile} from 'node:fs/promises';
const args=process.argv.slice(2),options={};
for(let i=0;i<args.length;i+=2){if(!args[i]?.startsWith('--')||!args[i+1])throw Error('Use --database-id UUID --team-domain https://TEAM.cloudflareaccess.com --audience AUD --admin-emails email[,email]');options[args[i].slice(2)]=args[i+1];}
const config=JSON.parse(await readFile('wrangler.jsonc','utf8'));
if(options['database-id']){
 if(!/^[a-f0-9-]{36}$/i.test(options['database-id'])||options['database-id']==='00000000-0000-4000-8000-000000000000')throw Error('Use the actual D1 database ID from your Cloudflare dashboard.');
 config.d1_databases[0].database_id=options['database-id'];
}
if(options['team-domain']){
 const url=new URL(options['team-domain']);
 if(url.protocol!=='https:'||! /^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(url.hostname)||url.pathname!=='/'||url.port||url.search||url.hash||url.username||url.password)throw Error('Use your HTTPS Cloudflare Access team domain.');
 config.vars.CF_ACCESS_TEAM_DOMAIN=url.origin;
}
if(options.audience)config.vars.CF_ACCESS_AUD=options.audience;
if(options['admin-emails']){
 const emails=options['admin-emails'].split(',').map(value=>value.trim().toLowerCase());
 if(!emails.length||emails.some(email=>! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))throw Error('Supply approved adult admin email addresses.');
 config.vars.ADMIN_EMAILS=emails.join(',');
}
if(options.domain){
 if(!/^[a-z0-9.-]+$/i.test(options.domain)||!options.domain.includes('.'))throw Error('Use a hostname without protocol or path.');
 config.routes=[{pattern:options.domain,custom_domain:true}];
}
await writeFile('wrangler.jsonc',JSON.stringify(config,null,2)+'\n');
console.log('Cloudflare configuration updated. No credentials or API tokens were stored.');
