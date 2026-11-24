export const eras = [['Ancient','Discipline'],['Medieval','Faith'],['Feudal','Honor'],['Modern','Resilience'],['Frontier','Perseverance'],['Age of Sail','Courage'],['Industrial','Endurance'],['Future','Hope']] as const;
export type Material = { id:string; title:string; summary:string; body:string; section:string; era:string; type:string; age:number; involvement:string; status:string; fileKey:string; updatedAt:string };
export const ageLabel = (age:number) => age === 0 ? 'All ages' : `${age}+`;
export const resourceTypes = ['Article','Devotional','Guardian Stories','Printable','Episode'] as const;
export const recommendedAges=[0,3,6,8,10,12,15] as const;
export const audienceOptions=[['boys','Boys'],['girls','Girls'],['both','Both'],['parents','Parents']] as const;
export const audienceLabel=(key:string)=>audienceOptions.find(([value])=>value===key)?.[1]||key;
// Preserve existing content: adapt legacy labels on reads and saves, without rewriting rows.
export function normalizeMaterial<T extends {section:string;type:string}>(row:T):T{return {...row,section:row.section==='family'?'parents':row.section,type:row.type==='Guardian Story'?'Guardian Stories':row.type};}
export function normalizeIncoming(value:unknown){if(value&&typeof value==='object'&&!Array.isArray(value)){const row=value as Record<string,unknown>;return {...row,section:row.section==='family'?'parents':row.section,type:row.type==='Guardian Story'?'Guardian Stories':row.type};}return value;}
