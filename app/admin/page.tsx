import {isAdmin} from '@/lib/admin';
import Studio from './studio';
export const dynamic='force-dynamic';
export default async function Page(){
 if(!await isAdmin())return <main className="access-denied"><h1>Admin access required</h1><p>Sign in through the protected admin address using an approved VGM account.</p><a href="/">Return to adventures</a></main>;
 return <Studio/>;
}
