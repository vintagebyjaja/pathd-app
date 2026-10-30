/** Public-only values: Next.js must see static NEXT_PUBLIC references for browser builds. */
export function getPublicSupabaseConfig(){
 const url=(process.env.NEXT_PUBLIC_SUPABASE_URL||'').trim().replace(/\/$/,'');
 const key=(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||'').trim()||(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'').trim();
 let valid=!!url&&!!key&&!/^(sb_secret_|sk[-_])/i.test(key);
 try{const parsed=new URL(url);valid=valid&&['https:','http:'].includes(parsed.protocol)&&!parsed.username&&!parsed.password&&parsed.pathname==='/'&&!parsed.search&&!parsed.hash;if(key.split('.').length===3){const claim=key.split('.')[1]!.replace(/-/g,'+').replace(/_/g,'/');valid=valid&&JSON.parse(atob(claim.padEnd(Math.ceil(claim.length/4)*4,'='))).role==='anon';}}catch{valid=false;}
 return {url,key:valid?key:'',configured:valid};
}
