import handler from 'vinext/server/fetch-handler';
export default {
 fetch(request:Request,env:Cloudflare.Env,ctx:ExecutionContext){
  // Standalone hosting never accepts identity headers supplied by the caller.
  const clean=new Headers(request.headers);
  for(const name of Array.from(clean.keys()))if(name.startsWith('oai-authenticated-user-'))clean.delete(name);
  return handler.fetch(new Request(request,{headers:clean}),env,ctx);
 }
};
