import {env} from 'cloudflare:workers';
import {getDb} from '@/db';
import {material} from '@/db/schema';
import {and,eq} from 'drizzle-orm';
import {isAdmin} from '@/lib/admin';
export const dynamic='force-dynamic';
export async function GET(req:Request,{params}:{params:Promise<{key:string}>}){
 const {key}=await params;if(!/^[a-f0-9-]+\.(pdf|png|jpg|webp|mp4)$/.test(key))return new Response(null,{status:404});
 const [entry]=await getDb().select({id:material.id}).from(material).where(and(eq(material.fileKey,key),eq(material.status,'published'))).limit(1);
 if(!entry&&!await isAdmin())return new Response(null,{status:404});
 const obj=await env.BUCKET!.get(key,{range:req.headers});if(!obj)return new Response(null,{status:404});
 const headers=new Headers({'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'});obj.writeHttpMetadata(headers);
 let status=200;if(obj.range&&'offset' in obj.range&&obj.range.offset!==undefined&&obj.range.length!==undefined){status=206;headers.set('Content-Range',`bytes ${obj.range.offset}-${obj.range.offset+obj.range.length-1}/${obj.size}`);headers.set('Content-Length',String(obj.range.length));}else headers.set('Content-Length',String(obj.size));
 return new Response(obj.body,{status,headers});
}
