import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'Valiant Guardian Kids',description:'Big adventures. Brave hearts. Faith for everyday life.',icons:{icon:'/art/vgk-shared-logo.png'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
