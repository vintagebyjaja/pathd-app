// Validate PUBLIC inputs before Next can inline them into browser bundles. Never print keys.
const url=(process.env.NEXT_PUBLIC_SUPABASE_URL||'').trim();
const key=(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||'').trim();
if(key){
 if(key.startsWith('sb_secret_')||key===process.env.SUPABASE_SERVICE_ROLE_KEY)throw Error('A privileged key was placed in a NEXT_PUBLIC Supabase variable. Build refused.');
 if(key.split('.').length===3){let role;try{role=JSON.parse(Buffer.from(key.split('.')[1],'base64url').toString()).role;}catch{throw Error('The public Supabase JWT is invalid.');}if(role!=='anon')throw Error('Only a Supabase anon JWT or publishable key may be public.');}
 if(!url)throw Error('NEXT_PUBLIC_SUPABASE_URL is required with the public key.');
 const parsed=new URL(url);if(!['https:','http:'].includes(parsed.protocol)||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw Error('The public Supabase project URL is invalid.');
}else console.warn('Supabase public credentials are absent: account features stay unavailable; production will not create demo member sessions.');
