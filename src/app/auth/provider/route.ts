import {NextRequest,NextResponse} from 'next/server';
import {createSupabaseServerClient} from '@/lib/supabase/server';
export async function GET(request:NextRequest){
 const url=new URL(request.url),provider=url.searchParams.get('provider'),link=url.searchParams.get('link')==='1';
 if(!['google','apple'].includes(provider||''))return NextResponse.redirect(new URL('/sign-in?error=provider',url));
 if(link&&request.headers.get('sec-fetch-site')==='cross-site')return NextResponse.json({error:'Start linking from your account settings.'},{status:403});
 const proposed=url.searchParams.get('next')||'/home',next=proposed.startsWith('/')&&!proposed.startsWith('//')&&!proposed.includes('\\')?proposed:'/home';
 try{const sb=await createSupabaseServerClient();const callback=url.origin+'/auth/callback?next='+encodeURIComponent(next);let id='';
 if(link){const {data,error}=await sb.auth.getUser();if(error||!data.user)return NextResponse.redirect(new URL('/sign-in',url));if(!data.user.last_sign_in_at||Date.now()-Date.parse(data.user.last_sign_in_at)>300000)return NextResponse.redirect(new URL('/sign-in?next=/settings/security',url));id=data.user.id;}
 const options={redirectTo:callback,skipBrowserRedirect:true};
 const result=link?await sb.auth.linkIdentity({provider:provider as 'google'|'apple',options}):await sb.auth.signInWithOAuth({provider:provider as 'google'|'apple',options});
 if(result.error||!result.data.url)return NextResponse.redirect(new URL('/sign-in?error=provider',url));
 const target=new URL(result.data.url);if(target.protocol!=='https:')throw Error('Invalid redirect');
 const response=NextResponse.redirect(target);if(id)response.cookies.set('pathd-link-user',id,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/auth',maxAge:600});else response.cookies.delete('pathd-link-user');return response;
 }catch{return NextResponse.redirect(new URL('/sign-in?error=provider',url));}
}
