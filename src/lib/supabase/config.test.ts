import {afterEach,expect,it,vi} from 'vitest';
import {getPublicSupabaseConfig} from './config';
afterEach(()=>vi.unstubAllEnvs());
function setup(){vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://xkpzabgpesishxcluxkp.supabase.co');vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','');vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','');}
it('supports the publishable key without a legacy key',()=>{setup();vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','sb_publishable_test_fixture');expect(getPublicSupabaseConfig().configured).toBe(true);});
it('supports legacy anon JWTs',()=>{setup();vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY','header.'+btoa(JSON.stringify({role:'anon'}))+'.fixture');expect(getPublicSupabaseConfig().configured).toBe(true);});
it('rejects privileged and malformed public inputs',()=>{setup();for(const key of ['sb_secret_test_fixture','header.'+btoa(JSON.stringify({role:'service_role'}))+'.fixture']){vi.stubEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',key);expect(getPublicSupabaseConfig().key).toBe('');}vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL','https://user:password@example.test');expect(getPublicSupabaseConfig().configured).toBe(false);});
it('missing credentials are unavailable rather than authenticated',()=>{setup();expect(getPublicSupabaseConfig().configured).toBe(false);});
