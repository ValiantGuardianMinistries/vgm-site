import {createRemoteJWKSet,jwtVerify,type JWTVerifyGetKey} from 'jose';

export type AccessConfig={CF_ACCESS_TEAM_DOMAIN?:string;CF_ACCESS_AUD?:string;ADMIN_EMAILS?:string};
const keySets=new Map<string,ReturnType<typeof createRemoteJWKSet>>();

export function accessIssuer(config:AccessConfig):string|null{
 try{
  const url=new URL(config.CF_ACCESS_TEAM_DOMAIN||'');
  if(url.protocol!=='https:'||! /^[a-z0-9-]+\.cloudflareaccess\.com$/i.test(url.hostname)||url.port||url.username||url.password||url.search||url.hash||url.pathname!=='/'||url.hostname==='replace-me.cloudflareaccess.com')return null;
  return url.origin;
 }catch{return null;}
}

function readToken(headers:Headers):string|null{
 const assertion=headers.get('cf-access-jwt-assertion');
 if(assertion)return assertion;
 // The admin page's Access session is also sent on same-origin API requests.
 const cookies=(headers.get('cookie')||'').split(';').map(value=>value.trim());
 const matches=cookies.filter(value=>value.startsWith('CF_Authorization='));
 return matches.length===1?matches[0].slice('CF_Authorization='.length):null;
}

export async function verifyAccessAdmin(headers:Headers,config:AccessConfig,testKey?:JWTVerifyGetKey):Promise<boolean>{
 const issuer=accessIssuer(config),audience=config.CF_ACCESS_AUD?.trim();
 const allowed=(config.ADMIN_EMAILS||'').split(',').map(email=>email.trim().toLowerCase()).filter(Boolean);
 const token=readToken(headers);
 if(!issuer||!audience||audience.startsWith('REPLACE_')||!allowed.length||!token||token.length>16384)return false;
 try{
  let key=testKey;
  if(!key){
   let remote=keySets.get(issuer);
   if(!remote){remote=createRemoteJWKSet(new URL('/cdn-cgi/access/certs',issuer),{timeoutDuration:5000});keySets.set(issuer,remote);}
   key=remote;
  }
  const {payload}=await jwtVerify(token,key,{issuer,audience,algorithms:['RS256'],requiredClaims:['exp','iat','sub','iss','aud'],clockTolerance:5});
  return typeof payload.email==='string'&&allowed.includes(payload.email.trim().toLowerCase());
 }catch{return false;}
}
