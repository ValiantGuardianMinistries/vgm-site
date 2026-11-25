// Browser-only integration with the ministry's owner admin area. This does not
// replace or grant Cloudflare Access authorization on any content operation.
export const executiveOrigin='https://discipleship.valiantguardianministries.org';

export function trustedAdminOrigin(request:Request):boolean {
 const origin=request.headers.get('origin');
 return origin===new URL(request.url).origin||origin===executiveOrigin;
}
export function withExecutiveCors(request:Request,response:Response):Response {
 const headers=new Headers(response.headers);
 headers.set('Cache-Control','private, no-store');
 const vary=headers.get('Vary');
 headers.set('Vary',vary?vary+', Origin':'Origin');
 if(request.headers.get('origin')===executiveOrigin){
  headers.set('Access-Control-Allow-Origin',executiveOrigin);
  headers.set('Access-Control-Allow-Credentials','true');
 }
 return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
export function executivePreflight(request:Request,methods:string[]):Response {
 const origin=request.headers.get('origin');
 const method=request.headers.get('access-control-request-method')??'';
 const names=(request.headers.get('access-control-request-headers')??'').toLowerCase().split(',').map(x=>x.trim()).filter(Boolean);
 if(origin!==executiveOrigin||!methods.includes(method)||names.some(name=>name!=='content-type')){
  return new Response(null,{status:403,headers:{'Cache-Control':'private, no-store','Vary':'Origin'}});
 }
 return withExecutiveCors(request,new Response(null,{status:204,headers:{
  'Access-Control-Allow-Methods':methods.join(', '),'Access-Control-Allow-Headers':'Content-Type',
 }}));
}
