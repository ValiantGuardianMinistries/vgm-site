'use client';
import {useEffect,useRef} from 'react';
import {ChevronDown,Map} from 'lucide-react';
import {destinations,destinationPath} from '@/lib/world';
export default function QuickAccess(){
 const ref=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{const outside=(e:PointerEvent)=>{if(ref.current&&!ref.current.contains(e.target as Node))ref.current.open=false};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside)},[]);
 const close=()=>{if(ref.current)ref.current.open=false};
 return <details className="quick-access" ref={ref} onKeyDown={e=>{if(e.key==='Escape'){close();ref.current?.querySelector('summary')?.focus()}}}><summary><Map size={17}/> All areas <ChevronDown size={15}/></summary><div className="quick-panel"><div className="quick-panel-heading"><b>Pick an age. Pick an adventure.</b><a href="/#library" onClick={close}>Browse everything</a></div><div className="quick-grid">{destinations.map(d=><div className="quick-destination" key={d.era}><div className="quick-era"><span aria-hidden="true">{d.icon}</span><span><b>{d.era}</b><small>{d.ageText}{d.era==='Ancient'?' · parent-led':''}</small></span></div><div className="quick-genders"><a aria-label={`${d.era} boys, ${d.ageText}`} href={destinationPath(d.era,'boys')} onClick={close}>Boys</a><a aria-label={`${d.era} girls, ${d.ageText}`} href={destinationPath(d.era,'girls')} onClick={close}>Girls</a></div></div>)}</div><p>Age recommendations guide browsing. Parents choose what fits their child.</p></div></details>
}
