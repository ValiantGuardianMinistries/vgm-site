import {getDb} from '@/db';
import {totals} from '@/db/schema';
import {gte,desc} from 'drizzle-orm';
import {isAdmin,privateHeaders} from '@/lib/admin';
export const dynamic='force-dynamic';
export async function GET(){
 if(!await isAdmin())return Response.json({error:'Admin access required'},{status:403,headers:privateHeaders});
 return Response.json(await getDb().select().from(totals).where(gte(totals.day,new Date(Date.now()-29*86400000).toISOString().slice(0,10))).orderBy(desc(totals.day)),{headers:privateHeaders});
}
