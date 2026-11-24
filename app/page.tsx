import Home from './home';
import {isAdmin} from '@/lib/admin';
import {audienceOptions,resourceTypes} from '@/lib/catalog';
export const dynamic='force-dynamic';
export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}){const p=await searchParams;const audience=audienceOptions.some(([v])=>v===p.audience)?String(p.audience):'all';const kind=resourceTypes.some(v=>v===p.resource)?String(p.resource):'all';return <Home admin={await isAdmin()} initialAudience={audience} initialKind={kind}/>}
