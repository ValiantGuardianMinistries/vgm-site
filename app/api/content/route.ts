import {env} from 'cloudflare:workers';
import {resourceTypes,normalizeMaterial,normalizeIncoming} from '@/lib/catalog';
import {z} from 'zod';
import {getDb} from '@/db';
import {material} from '@/db/schema';
import {eq,desc,inArray} from 'drizzle-orm';
import {isAdmin,sameOrigin,privateHeaders} from '@/lib/admin';
export const dynamic='force-dynamic';
export async function GET(req:Request){
 const admin=new URL(req.url).searchParams.get('admin')==='1';
 if(admin && !await isAdmin())return Response.json({error:'Admin access required'},{status:403,headers:privateHeaders});
 const rows=await getDb().select().from(material).where(admin?undefined:inArray(material.status,['published','coming-soon'])).orderBy(desc(material.updatedAt));return Response.json(rows.map(row=>normalizeMaterial(!admin&&row.status==='coming-soon'?{...row,body:'',fileKey:''}:row)),{headers:privateHeaders});
}
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return Response.json({error:'Admin access required'},{status:403});
 const schema=z.object({id:z.string().optional(),title:z.string().trim().min(1).max(160),summary:z.string().max(500),body:z.string().max(60000),section:z.enum(['boys','girls','both','parents']),era:z.enum(['Ancient','Medieval','Feudal','Modern','Frontier','Age of Sail','Industrial','Future']),type:z.enum(resourceTypes),age:z.union([z.literal(0),z.literal(3),z.literal(6),z.literal(8),z.literal(10),z.literal(12),z.literal(15)]),involvement:z.enum(['On your own','Parent nearby','Do together']),status:z.enum(['draft','locked','coming-soon','published']),fileKey:z.string().optional()});
 const parsed=schema.safeParse(normalizeIncoming(await req.json().catch(()=>null)));if(!parsed.success)return Response.json({error:'Please check the content fields.'},{status:400});const b=parsed.data;
 const fileKey=typeof b.fileKey==='string'&&/^[a-f0-9-]+\.(pdf|png|jpg|webp|mp4)$/.test(b.fileKey)?b.fileKey:'';
 if(b.status==='published'&&['Printable','Episode'].includes(b.type)&&!fileKey)return Response.json({error:'Attach a file before publishing this resource.'},{status:400});
 if(fileKey){const obj=await env.BUCKET!.head(fileKey);if(!obj)return Response.json({error:'The attachment is missing. Please upload it again.'},{status:400});if(b.type==='Episode'&&!fileKey.endsWith('.mp4'))return Response.json({error:'Episodes need an MP4 attachment.'},{status:400});if(b.type==='Printable'&&fileKey.endsWith('.mp4'))return Response.json({error:'Printables need a PDF or image attachment.'},{status:400});}
 const row={id:typeof b.id==='string'&&/^[a-f0-9-]{36}$/.test(b.id)?b.id:crypto.randomUUID(),title:b.title.trim(),summary:b.summary.trim(),body:b.body,section:b.section,era:b.era,type:b.type,age:b.age,involvement:b.involvement,status:b.status,fileKey,updatedAt:new Date().toISOString()};
 await getDb().insert(material).values(row).onConflictDoUpdate({target:material.id,set:row});return Response.json(row,{headers:privateHeaders});
}
