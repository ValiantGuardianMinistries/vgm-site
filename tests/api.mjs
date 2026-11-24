// Exercise real route handlers with SQLite and a small in-memory R2 stand-in.
import {build} from 'esbuild';
import {DatabaseSync} from 'node:sqlite';
import {readFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const db=new DatabaseSync(':memory:');db.exec(await readFile('drizzle/0000_abandoned_archangel.sql','utf8'));
const objects=new Map();
const statement=(sql,params=[])=>({bind(...p){return statement(sql,p)},async all(){return {results:db.prepare(sql).all(...params),success:true}},async raw(){const s=db.prepare(sql);s.setReturnArrays(true);return s.all(...params)},async run(){return {success:true,meta:db.prepare(sql).run(...params)}}});
globalThis.testEnv={ADMIN_EMAILS:'owner@example.test',DB:{prepare:statement},BUCKET:{async put(key,bytes,options){objects.set(key,{bytes,options})},async head(key){return objects.has(key)?{}:null},async get(key){const o=objects.get(key);if(!o)return null;return {body:o.bytes,size:o.bytes.length,writeHttpMetadata(h){h.set('Content-Type',o.options.httpMetadata.contentType)}}}}};
globalThis.testHeaders=new Headers();
await mkdir('.sites-runtime/api-tests',{recursive:true});
const routes={};for(const name of ['content','events','stats','starter','uploads','media/[key]']){const out='.sites-runtime/api-tests/'+name.replaceAll('/','-')+'.mjs';await build({entryPoints:['app/api/'+name+'/route.ts'],outfile:out,bundle:true,platform:'node',format:'esm',plugins:[{name:'test-bindings',setup(b){b.onResolve({filter:/^\.\/access$/},args=>({path:args.path,namespace:'test-access'}));b.onLoad({filter:/.*/,namespace:'test-access'},()=>({contents:'export async function verifyAccessAdmin(headers){return headers.get("x-test-admin-identity")==="owner@example.test";}',loader:'js'}));b.onResolve({filter:/^(cloudflare:workers|next\/headers)$/},args=>({path:args.path,namespace:'test'}));b.onLoad({filter:/.*/,namespace:'test'},args=>({contents:args.path==='cloudflare:workers'?'export const env=globalThis.testEnv;':'export async function headers(){return globalThis.testHeaders;}',loader:'js'}));}}]});routes[name]=await import('../'+out);}
let passed=0;
async function call(route,method='GET',body,auth='',origin='https://kids.test',mime='application/json',params){const h=new Headers({'Origin':origin});if(auth){h.set('x-test-admin-identity',auth)}if(body!==undefined)h.set('Content-Type',mime);globalThis.testHeaders=h;const req=new Request('https://kids.test/api/'+route,{method,headers:h,body:body===undefined?undefined:body instanceof Uint8Array?body:JSON.stringify(body)});return routes[route.split('?')[0]][method](req,params?{params:Promise.resolve(params)}:undefined);}
function status(r,s,label){assert.equal(r.status,s,label);passed++;}
status(await call('content?admin=1'),403,'anonymous draft list');status(await call('stats'),403,'anonymous statistics');status(await call('content','POST',{}),403,'anonymous writing');status(await call('starter','POST',{},'other@example.test'),403,'non-admin identity');status(await call('starter','POST',{},'owner@example.test','https://evil.test'),403,'cross-origin mutation');status(await call('starter','POST',{},'owner@example.test'),200,'owner seeds collection');
let rows=await (await call('content?admin=1','GET',undefined,'owner@example.test')).json();assert.equal(rows.length,6);passed++;
let publicRows=await(await call('content')).json();assert.equal(publicRows.length,4);passed++;
status(await call('content','POST',null,'owner@example.test'),400,'null input');
let row=rows.find(r=>r.type==='Printable');status(await call('content','POST',{...row,status:'published'},'owner@example.test'),400,'attachment required');
status(await call('uploads','POST',new TextEncoder().encode('fake'),'owner@example.test','https://kids.test','application/pdf'),400,'file signature');
const upload=await call('uploads','POST',new TextEncoder().encode('%PDF-1.4\n%%EOF'),'owner@example.test','https://kids.test','application/pdf');status(upload,200,'valid file upload');const {key}=await upload.json();
status(await call('content','POST',{...row,status:'published',fileKey:key},'owner@example.test'),200,'publish printable');
status(await call('media/[key]','GET',undefined,'','https://kids.test','application/json',{key}),200,'published file readable');
status(await call('content','POST',{...row,status:'draft',fileKey:key},'owner@example.test'),200,'unpublish printable');status(await call('media/[key]','GET',undefined,'','https://kids.test','application/json',{key}),404,'unpublished file hidden');
status(await call('events','POST',{id:publicRows[0].id,event:'view'}),204,'anonymous event');status(await call('events','POST',{id:publicRows[0].id,event:'view'},'owner@example.test'),204,'admin event excluded');status(await call('events','POST',{id:row.id,event:'view'}),404,'draft event rejected');
const totals=await(await call('stats','GET',undefined,'owner@example.test')).json();assert.equal(totals.reduce((a,b)=>a+b.count,0),1);passed++;
status(await call('content','POST',{...publicRows[0],title:'Edited activity'},'owner@example.test'),200,'update existing resource');rows=await(await call('content?admin=1','GET',undefined,'owner@example.test')).json();assert.equal(rows.length,6);assert.equal(rows.find(r=>r.id===publicRows[0].id).title,'Edited activity');passed++;
status(await call('content','POST',{...publicRows[0],type:'Guardian Story',age:3},'owner@example.test'),200,'preschool historical fiction allowed');
status(await call('content','POST',{...publicRows[0],type:'Devotional',age:6},'owner@example.test'),200,'early-childhood devotional allowed');
status(await call('content','POST',{...publicRows[0],age:5},'owner@example.test'),400,'unsupported minimum age rejected');
status(await call('content','POST',{...publicRows[0],section:'both',type:'Guardian Stories'},'owner@example.test'),200,'shared audience and plural Guardian Stories');
status(await call('content','POST',{...publicRows[0],section:'parents'},'owner@example.test'),200,'parents audience');
status(await call('content','POST',{...publicRows[0],section:'family',type:'Guardian Story'},'owner@example.test'),200,'legacy labels accepted without data loss');
const legacyRows=await(await call('content')).json();assert.equal(legacyRows.find(r=>r.id===publicRows[0].id).section,'parents');assert.equal(legacyRows.find(r=>r.id===publicRows[0].id).type,'Guardian Stories');passed++;
status(await call('content','POST',{...publicRows[0],section:'unknown'},'owner@example.test'),400,'unknown audience rejected');
// Public previews expose metadata only; private states also protect attached media.
const previewRow={...publicRows[0],id:crypto.randomUUID(),title:'Future resource',body:'PRIVATE EDITORIAL CONTENT',fileKey:key,status:'coming-soon'};
status(await call('content','POST',previewRow,'owner@example.test'),200,'save Coming Soon');
let previewRows=await(await call('content')).json();
const previewItem=previewRows.find(r=>r.id===previewRow.id);assert.ok(previewItem);assert.equal(previewItem.body,'');assert.equal(previewItem.fileKey,'');passed++;
status(await call('media/[key]','GET',undefined,'','https://kids.test','application/json',{key}),404,'Coming Soon attachment hidden');
status(await call('content','POST',{...previewRow,status:'locked'},'owner@example.test'),200,'save Locked');
previewRows=await(await call('content')).json();assert.ok(!previewRows.some(r=>r.id===previewRow.id));passed++;
status(await call('media/[key]','GET',undefined,'','https://kids.test','application/json',{key}),404,'Locked attachment hidden');
status(await call('events','POST',{id:previewRow.id,event:'view'}),404,'Locked activity rejected');
const adminRows=await(await call('content?admin=1','GET',undefined,'owner@example.test')).json();assert.equal(adminRows.find(r=>r.id===previewRow.id).body,'PRIVATE EDITORIAL CONTENT');passed++;
console.log(`${passed} API checks passed: access, CSRF, drafts, upload validation, media privacy, persistence, and aggregate stats.`);
