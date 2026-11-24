export const destinations = [
 {era:'Ancient',name:'The Ancient Academy',age:0,ageText:'Infants–2',virtue:'Discipline',x:25,y:34,icon:'🏛',color:'gold',teaser:'Start small. Discover something big.'},
 {era:'Medieval',name:'Castle Courage',age:3,ageText:'Ages 3–5',virtue:'Faith',x:75,y:35,icon:'🏰',color:'blue',teaser:'A brave heart begins with faith.'},
 {era:'Feudal',name:'The Blossom Village',age:6,ageText:'Ages 6–7',virtue:'Honor',x:24,y:54,icon:'🌸',color:'pink',teaser:'Practice kindness. Keep your word.'},
 {era:'Age of Sail',name:'Courage Cove',age:8,ageText:'Ages 8–9',virtue:'Courage',x:76,y:56,icon:'⛵',color:'teal',teaser:'There’s a whole horizon to discover.'},
 {era:'Frontier',name:'The Frontier Outpost',age:10,ageText:'Ages 10–11',virtue:'Perseverance',x:25,y:74,icon:'🏕',color:'orange',teaser:'Try. Learn. Try a little differently.'},
 {era:'Industrial',name:'The Wonder Workshop',age:12,ageText:'Ages 12–14',virtue:'Endurance',x:76,y:75,icon:'⚙',color:'gold',teaser:'Big ideas start with curious minds.'},
 {era:'Modern',name:'Guardian Basecamp',age:15,ageText:'Ages 15–17',virtue:'Resilience',x:25,y:97,icon:'🧭',color:'green',teaser:'Grow strong. Show up for others.'},
 {era:'Future',name:'Hope Station',age:0,ageText:'All ages',virtue:'Hope',x:75,y:98,icon:'🚀',color:'purple',teaser:'The next chapter is yours to explore.'}
] as const;
export const devotionalDays = ['Heart','Soul','Mind','Strength','Community','Father–son / Mother–daughter','Rest'] as const;
export function devotionalTemplate(day:string){
 const rest=day==='Rest',paired=day==='Father–son / Mother–daughter';
 const action=rest?'Choose a restful, unhurried way to enjoy the day together. No performance target or extra task is needed.':paired?'Offer one father–son activity and one mother–daughter activity connected to the same theme. Include an option with another trusted caregiver.':'Offer a small, achievable action, age-appropriate options, and an alternative for different abilities.';
 return `## ${day}\nWeekly theme: [Add the theme from the adult devotional]\nBible passage: [Add the reference]\n\n## Bible story\nWhat happened? Tell the true Bible story in language children can understand.\n\n## Big idea\nWhat does this teach us about God and how we live? Connect it to ${day.toLowerCase()}.\n\n## Real life\nWhen might a kid face something similar?\n\n## Challenge\nWhat could someone actually do today? ${action}\n\n## Discussion\nWhat would you ask another kid?\n\n## Prayer\nWhat would you ask God to help with?`;
}
export function storyTemplate(){return `## A guardian through the ages\nHistorical fiction — an imagined adventure in a real historical setting.\nEra: [Choose the era]\n\n## Meet our guardian\n[Introduce the character and setting.]\n\n## The adventure\n[Give the guardian a meaningful challenge and a courageous, thoughtful response.]\n\n## What is history, and what is imagined?\n[Separate verified historical details from fictional characters and events. Keep these stories distinct from Bible accounts.]\n\n## Talk about it\n[What can we learn from the guardian’s choices?]`;}
export function recommendationTemplate(){return `## For parents\nTitle: [Book or movie title]\nCreator: [Author or director]\nRecommended age: [Give a minimum age recommendation]\n\n## What it is about\n[Write a short, spoiler-light description.]\n\n## Why we chose it\n[What is worth noticing, learning, or discussing?]\n\n## Parent notes\n[Describe relevant themes or content so parents can decide for their family. Explain the basis of your review.]\n\n## Talk about it together\n[Add a few thoughtful questions.]`;}

export type Destination = typeof destinations[number];
export const eraSlugs:Record<string,string>={'Ancient':'ancient','Medieval':'medieval','Feudal':'feudal','Age of Sail':'age-of-sail','Frontier':'frontier','Industrial':'industrial','Modern':'modern','Future':'future'};
export function destinationPath(era:string,audience:'boys'|'girls'){return `/world/${eraSlugs[era]}/${audience}`;}
export const destinationBySlug=(slug:string)=>destinations.find(d=>eraSlugs[d.era]===slug);
export const destinationActivities:Record<string,string>={
 Ancient:'Share a picture book, name something beautiful, and enjoy a quiet moment with your little guardian.',
 Medieval:'Build something small, practice a kind word, and discover what a brave heart looks like.',
 Feudal:'Notice a beautiful detail, make something with care, and practice keeping your word.',
 'Age of Sail':'Ask a good question, learn a useful skill, and take one small courageous step.',
 Frontier:'Look closely at creation, try something new, and keep going when the first attempt is tricky.',
 Industrial:'Ask how something works, test a thoughtful idea, and learn from what happens.',
 Modern:'Practice a useful skill, look out for someone else, and grow in steady responsibility.',
 Future:'Imagine something good, learn alongside others, and bring a little hope into today.'
};

// Each numbered devotional is one resource containing the complete seven-day week.
export function weeklyDevotionalTemplate(week:number){
 if(!Number.isInteger(week)||week<1||week>52)throw new RangeError('Choose a devotional week from 1 to 52.');
 return `# Devotional ${week}\nWeekly theme: [Use the approved adult weekly devotional]\nOne complete week to read together and return to during the week.\n\n`+devotionalDays.map(day=>devotionalTemplate(day)).join('\n\n');
}
