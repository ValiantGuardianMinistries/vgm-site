import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
test('paused homepage has no Meta loader, event calls or tracking image',()=>{
  assert.equal(/connect\.facebook\.net|fbevents\.js|facebook\.com\/tr\?|fbq\s*\(/.test(html),false);
  assert.match(html,/Optional advertising measurement is off/);
});
test('pause clears the prior optional preference and only its measurement cookies',()=>{
  const script=html.match(/<script>\s*(\/\/ Advertising measurement is paused[\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const removed=[],cookies=[];
  vm.runInNewContext(script,{localStorage:{removeItem:key=>removed.push(key)},document:{set cookie(value){cookies.push(value);}}});
  assert.deepEqual(removed,['vgm_optional_meta_measurement_v1']);
  assert.equal(cookies.length,6);
  assert.equal(cookies.every(value=>/^_fb[pc]=; Max-Age=0;/.test(value)),true);
  assert.equal(cookies.every(value=>value.includes('Path=/; Secure; SameSite=Lax')),true);
  assert.doesNotThrow(()=>vm.runInNewContext(script,{localStorage:{removeItem(){throw Error('disabled');}},document:{set cookie(value){}}}));
});
