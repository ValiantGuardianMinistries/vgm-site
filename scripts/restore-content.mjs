import {readFile,readdir,stat} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {spawnSync} from 'node:child_process';

const args=process.argv.slice(2),backupArg=args.find(value=>!value.startsWith('--'));
if(!backupArg||!args.includes('--remote'))throw Error('Use node scripts/restore-content.mjs /path/to/VGK_Backup --remote after configuring Cloudflare and applying schema migrations.');
const backup=resolve(backupArg),config=JSON.parse(await readFile('wrangler.jsonc','utf8'));
if(config.d1_databases[0].database_id==='00000000-0000-4000-8000-000000000000')throw Error('Configure the real D1 database first.');
const data=JSON.parse(await readFile(join(backup,'content.json'),'utf8'));
const keys=[...new Set(data.material.map(row=>row.file_key).filter(Boolean))];
// Check all expected files before creating any remote objects or rows.
for(const key of keys){if(!/^[a-f0-9-]+\.(pdf|png|jpg|webp|mp4)$/.test(key))throw Error('Invalid attachment key in backup.');await stat(join(backup,'media',key));}
const cli=resolve('node_modules/wrangler/bin/wrangler.js');
function run(params){const result=spawnSync(process.execPath,[cli,...params],{stdio:'inherit'});if(result.error)throw result.error;if(result.status!==0)throw Error('Cloudflare restore stopped. Resolve the error before retrying.');}
const mime={pdf:'application/pdf',png:'image/png',jpg:'image/jpeg',webp:'image/webp',mp4:'video/mp4'};
for(const key of keys)run(['r2','object','put',config.r2_buckets[0].bucket_name+'/'+key,'--file',join(backup,'media',key),'--content-type',mime[key.split('.').pop()],'--remote']);
run(['d1','execute','DB','--file',join(backup,'content.sql'),'--remote']);
console.log(`Restore completed: ${data.material.length} source resources; ${keys.length} attachments. Existing database IDs were not overwritten.`);
