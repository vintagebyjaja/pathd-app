import {beforeEach,expect,it,vi} from 'vitest';
import {NextRequest} from 'next/server';
const fixture=vi.hoisted(()=>({user:true,options:null as any}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{getUser:async()=>({data:{user:fixture.user?{id:'verified-id',last_sign_in_at:new Date().toISOString()}:null},error:null}),signInWithOAuth:async(options:any)=>{fixture.options=options;return {data:{url:'https://provider.example.test/authorize'},error:null};},linkIdentity:async(options:any)=>{fixture.options=options;return {data:{url:'https://provider.example.test/link'},error:null};}}})}));
import {GET} from '@/app/auth/provider/route';
beforeEach(()=>{fixture.user=true;fixture.options=null;});
it('uses a same-site PKCE callback without calendar scopes',async()=>{const r=await GET(new NextRequest('https://mypathd.com/auth/provider?provider=google&next=https://evil.test'));expect(r.status).toBe(307);expect(fixture.options.options.redirectTo).toBe('https://mypathd.com/auth/callback?next=%2Fhome');expect(fixture.options.options.scopes).toBeUndefined();});
it('links only an already verified user and binds callback to that UUID',async()=>{const r=await GET(new NextRequest('https://mypathd.com/auth/provider?provider=apple&link=1'));expect(r.cookies.get('pathd-link-user')?.value).toBe('verified-id');fixture.user=false;await GET(new NextRequest('https://mypathd.com/auth/provider?provider=apple&link=1'));expect(fixture.options.provider).toBe('apple');});
it('rejects cross-site provider linking before calling Auth',async()=>{const r=await GET(new NextRequest('https://mypathd.com/auth/provider?provider=google&link=1',{headers:{'sec-fetch-site':'cross-site'}}));expect(r.status).toBe(403);expect(fixture.options).toBeNull();});
