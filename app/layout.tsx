import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Valiant Guardian Kids',description:'Big adventures. Brave hearts. Faith for everyday life.',applicationName:'Valiant Guardian Kids',appleWebApp:{capable:true,title:'VGK'},manifest:'/vgk.webmanifest',icons:{icon:[{url:'/vgk-icon-512.png',type:'image/png',sizes:'512x512'}],apple:[{url:'/vgk-apple-touch-icon.png',type:'image/png',sizes:'180x180'}]}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
