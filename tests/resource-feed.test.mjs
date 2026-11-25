import assert from 'node:assert/strict';
import test from 'node:test';
import { safeResources, renderResources, loadResources } from '../resource-feed.mjs';

const row=(fields={})=>({title:'Lesson',description:'Description',category:'video',url:'https://example.com/lesson',publishedAt:100,...fields});

test('public resource feed rejects unsafe links and filters categories',()=>{
  const payload={resources:[
    row(),row({category:'article',title:'Article'}),
    row({url:'javascript:alert(1)'}),row({url:'http://example.com'}),
    row({url:'https://user:secret@example.com/'}),row({url:'https://example.com:9000/'}),
    row({title:''}),row({category:'unknown'}),
  ]};
  assert.equal(safeResources(payload).length,2);
  assert.equal(safeResources(payload,'article')[0].title,'Article');
  assert.equal(safeResources(payload,'devotional').length,0);
  assert.deepEqual(safeResources(null),[]);
  assert.deepEqual(safeResources({resources:Array(201).fill(row())}),[]);
});

test('resource titles and descriptions render as text rather than executable markup',()=>{
  const make=(tag)=>({tag,children:[],append(child){this.children.push(child);}});
  const doc={createElement:make};
  const container={replaceChildren(...children){this.children=children;}};
  renderResources(container,[row({title:'<script>alert(1)</script>',description:'<img onerror=alert(1)>'})],doc);
  const link=container.children[0];
  assert.equal(link.children[0].textContent,'<script>alert(1)</script>');
  assert.equal(link.children[1].textContent,'<img onerror=alert(1)>');
  assert.equal(link.rel,'noopener noreferrer');
  assert.equal(link.target,'_blank');
  assert.equal('innerHTML' in link,false);
});

test('resources are ordered newest first without changing the source array',()=>{
  const first=row({publishedAt:1}),last=row({publishedAt:3});
  const payload={resources:[first,last]};
  assert.deepEqual(safeResources(payload),[last,first]);
  assert.deepEqual(payload.resources,[first,last]);
});

function documentFixture() {
  const container={replaceChildren(...children){this.children=children;}};
  const section={hidden:true,dataset:{vgmCategory:'video'},querySelector(){return container;}};
  const doc={querySelectorAll(){return [section];},createElement(tag){return {tag,children:[],append(child){this.children.push(child);}};}};
  return {doc,section,container};
}
test('feed fetch sends no account cookies or page referrer and reveals only populated sections',async()=>{
  const {doc,section,container}=documentFixture();
  await loadResources(doc,async(url,options)=>{
    assert.equal(url,'https://discipleship.valiantguardianministries.org/api/vgm-public-resources');
    assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');
    return {ok:true,json:async()=>({resources:[row()]})};
  });
  assert.equal(section.hidden,false);assert.equal(container.children.length,1);
});

test('unavailable or empty feeds leave existing website content and hide added sections',async()=>{
  for(const fetcher of [
    async()=>{throw new Error('Network unavailable');},
    async()=>({ok:false}),
    async()=>({ok:true,json:async()=>({resources:[]})}),
  ]) {
    const {doc,section}=documentFixture();
    await loadResources(doc,fetcher);
    assert.equal(section.hidden,true);
  }
});
