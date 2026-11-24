import {getDb} from '@/db';
import {material} from '@/db/schema';
import {starter} from '@/lib/starter';
import {isAdmin,sameOrigin} from '@/lib/admin';
export async function POST(req:Request){if(!sameOrigin(req)||!await isAdmin())return new Response(null,{status:403});for(const row of starter)await getDb().insert(material).values({...row,updatedAt:new Date().toISOString()}).onConflictDoNothing();return Response.json({ok:true});}
