import {env} from 'cloudflare:workers';
import {headers} from 'next/headers';
import {verifyAccessAdmin} from './access';
export async function isAdmin(){return verifyAccessAdmin(await headers(),env);}
export function sameOrigin(req:Request){return req.headers.get('origin')===new URL(req.url).origin;}
export const privateHeaders={'Cache-Control':'private, no-store'};
