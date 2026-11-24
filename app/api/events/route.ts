import {z} from 'zod';
import {getDb} from '@/db';
import {material,totals} from '@/db/schema';
import {eq,sql} from 'drizzle-orm';
import {isAdmin,sameOrigin} from '@/lib/admin';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 if(!sameOrigin(req))return new Response(null,{status:403});
 if(await isAdmin())return new Response(null,{status:204});
 const parsed=z.object({id:z.string().uuid(),event:z.enum(['view','download','video_start'])}).safeParse(await req.json().catch(()=>null));if(!parsed.success)return new Response(null,{status:400});const b=parsed.data;
 const [row]=await getDb().select().from(material).where(eq(material.id,b.id)).limit(1);
 if(!row||row.status!=='published'||(b.event==='download'&&row.type!=='Printable')||(b.event==='video_start'&&row.type!=='Episode'))return new Response(null,{status:404});
 await getDb().insert(totals).values({day:new Date().toISOString().slice(0,10),contentId:b.id,event:b.event,count:1}).onConflictDoUpdate({target:[totals.day,totals.contentId,totals.event],set:{count:sql`${totals.count}+1`}});
 return new Response(null,{status:204});
}
