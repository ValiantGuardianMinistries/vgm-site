import {build} from 'esbuild';
import {generateKeyPair,SignJWT,exportJWK,createLocalJWKSet} from 'jose';
import assert from 'node:assert/strict';
await build({entryPoints:['lib/access.ts'],outfile:'.test-output/access.mjs',bundle:true,platform:'node',format:'esm',packages:'external'});
const {verifyAccessAdmin}=await import('../.test-output/access.mjs');
const {privateKey,publicKey}=await generateKeyPair('RS256');
const jwk=await exportJWK(publicKey);jwk.kid='test-key';
const resolver=createLocalJWKSet({keys:[jwk]});
const config={CF_ACCESS_TEAM_DOMAIN:'https://vgk-test.cloudflareaccess.com',CF_ACCESS_AUD:'vgk-admin-test',ADMIN_EMAILS:'owner@example.test'};
const now=Math.floor(Date.now()/1000);
async function token(changes={}){return new SignJWT({email:'owner@example.test',sub:'adult-admin',iat:now,exp:now+3600,iss:config.CF_ACCESS_TEAM_DOMAIN,aud:config.CF_ACCESS_AUD,...changes}).setProtectedHeader({alg:'RS256',kid:'test-key'}).sign(privateKey);}
let count=0;
async function check(value,expected,label,cfg=config){assert.equal(await verifyAccessAdmin(new Headers(value),cfg,resolver),expected,label);count++;}
const valid=await token();
await check({'cf-access-jwt-assertion':valid},true,'approved signed admin');
await check({cookie:'CF_Authorization='+valid},true,'admin same-origin API cookie');
await check({},false,'anonymous visitor is not admin');
await check({'oai-authenticated-user-email':'owner@example.test','oai-authenticated-user-id':'spoofed'},false,'spoofed old identity rejected');
await check({'cf-access-jwt-assertion':await token({email:'other@example.test'})},false,'unapproved signed account');
await check({'cf-access-jwt-assertion':await token({exp:now-60})},false,'expired token');
await check({'cf-access-jwt-assertion':await token({nbf:now+3600})},false,'future token');
await check({'cf-access-jwt-assertion':await token({aud:'other-app'})},false,'wrong audience');
await check({'cf-access-jwt-assertion':await token({iss:'https://evil.example'})},false,'wrong issuer');
await check({'cf-access-jwt-assertion':valid.slice(0,-12)+'AAAAAAAAAAAA'},false,'tampered signature');
await check({'cf-access-jwt-assertion':valid},false,'empty allowlist',{...config,ADMIN_EMAILS:''});
await check({'cf-access-jwt-assertion':valid},false,'missing audience',{...config,CF_ACCESS_AUD:''});
await check({'cf-access-jwt-assertion':valid},false,'untrusted certificate host',{...config,CF_ACCESS_TEAM_DOMAIN:'https://attacker.example'});
await check({cookie:'CF_Authorization='+valid+'; CF_Authorization='+valid},false,'ambiguous cookies');
console.log(`${count} signed admin authentication checks passed.`);
