import {env} from 'cloudflare:workers';
import {isAdmin,sameOrigin} from '@/lib/admin';
export const dynamic='force-dynamic';
const types:Record<string,string>={'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg','image/webp':'webp','video/mp4':'mp4'};
export async function POST(req:Request){
 if(!sameOrigin(req)||!await isAdmin())return Response.json({error:'Admin access required'},{status:403});
 const mime=req.headers.get('content-type')||'', ext=types[mime];if(!ext)return Response.json({error:'Use PDF, PNG, JPG, WebP, or MP4.'},{status:400});
 const limit=25*1024*1024;if(Number(req.headers.get('content-length'))>limit)return Response.json({error:'Maximum file size is 25 MB.'},{status:413});
 const reader=req.body?.getReader();if(!reader)return Response.json({error:'No file supplied.'},{status:400});
 const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>limit){await reader.cancel();return Response.json({error:'Maximum file size is 25 MB.'},{status:413});}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
 const h=new TextDecoder().decode(bytes.slice(0,12));const valid=(ext==='pdf'&&h.startsWith('%PDF-'))||(ext==='png'&&bytes[0]===137&&h.slice(1,4)==='PNG')||(ext==='jpg'&&bytes[0]===255&&bytes[1]===216)||(ext==='webp'&&h.startsWith('RIFF')&&h.slice(8,12)==='WEBP')||(ext==='mp4'&&h.slice(4,8)==='ftyp');
 if(!valid)return Response.json({error:'The file contents do not match its type.'},{status:400});
 const key=crypto.randomUUID()+'.'+ext;await env.BUCKET!.put(key,bytes,{httpMetadata:{contentType:mime}});return Response.json({key});
}
