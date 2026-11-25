import {build} from 'esbuild';
import assert from 'node:assert/strict';
await build({entryPoints:['lib/executive-cors.ts'],outfile:'.test-output/executive-cors.mjs',bundle:true,platform:'node',format:'esm'});
const {executiveOrigin,trustedAdminOrigin,withExecutiveCors,executivePreflight}=await import('../.test-output/executive-cors.mjs');
const request=(origin,method='POST',extra={})=>new Request('https://kids.valiantguardianministries.org/api/content',{
 method,headers:{Origin:origin,...extra},
});
let passed=0;
for(const origin of [executiveOrigin,'https://kids.valiantguardianministries.org']){
 assert.equal(trustedAdminOrigin(request(origin)),true);passed++;
}
for(const origin of ['https://attacker.example','null','https://discipleship.valiantguardianministries.org.attacker.example','http://discipleship.valiantguardianministries.org']){
 assert.equal(trustedAdminOrigin(request(origin)),false);passed++;
 assert.equal(withExecutiveCors(request(origin),new Response('private')).headers.has('Access-Control-Allow-Origin'),false);passed++;
}
const headers=withExecutiveCors(request(executiveOrigin),new Response('denied',{status:403})).headers;
assert.equal(headers.get('Access-Control-Allow-Origin'),executiveOrigin);passed++;
assert.equal(headers.get('Access-Control-Allow-Credentials'),'true');passed++;
assert.equal(headers.get('Cache-Control'),'private, no-store');passed++;
assert.match(headers.get('Vary'),/Origin/);passed++;
const preflight=executivePreflight(request(executiveOrigin,'OPTIONS',{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'content-type'}),['GET','POST']);
assert.equal(preflight.status,204);assert.equal(await preflight.text(),'');passed++;
assert.equal(preflight.headers.get('Access-Control-Allow-Origin'),executiveOrigin);passed++;
for(const extra of [{'Access-Control-Request-Method':'DELETE'},{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization'},{'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'x-owner-email'}]){
 assert.equal(executivePreflight(request(executiveOrigin,'OPTIONS',extra),['GET','POST']).status,403);passed++;
}
assert.equal(executivePreflight(request('https://attacker.example','OPTIONS',{'Access-Control-Request-Method':'POST'}),['GET','POST']).status,403);passed++;
console.log(`${passed} executive origin and preflight checks passed.`);
