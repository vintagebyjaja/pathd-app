import {beforeEach,expect,it,vi} from 'vitest';
const fixture=vi.hoisted(()=>({profileError:false,enrolled:true,user:true}));
vi.mock('next/navigation',()=>({redirect:(path:string)=>{throw Error('redirect:'+path);}}));
vi.mock('@/lib/env',()=>({isSupabaseConfigured:true,isDemoMode:false}));
vi.mock('@/lib/companion/server',()=>({companionFetch:vi.fn()}));
vi.mock('@/lib/supabase/server',()=>({createSupabaseServerClient:async()=>({auth:{signInWithPassword:async()=>({error:null}),getUser:async()=>({error:null,data:{user:fixture.user?{id:'fixture-user'}:null}})},rpc:async(name:string)=>{expect(name).toBe('app_account_bootstrap');return {data:fixture.profileError?null:{user:{recovery_enrolled:fixture.enrolled}},error:fixture.profileError?{code:'PGRST202'}:null};}})}));
import {signIn} from '@/app/(auth)/actions';
beforeEach(()=>{fixture.profileError=false;fixture.enrolled=true;fixture.user=true;});
function form(next='/home'){const data=new FormData();data.set('email','fixture@example.test');data.set('password','existing-valid-password');data.set('next',next);return data;}
it('a verified existing login reaches the real dashboard even if the profile RPC needs repair',async()=>{fixture.profileError=true;const log=vi.spyOn(console,'error').mockImplementation(()=>{});await expect(signIn({},form())).rejects.toThrow('redirect:/home');expect(log).toHaveBeenCalledWith(expect.stringContaining('PGRST202'));log.mockRestore();});
it('a missing recovery enrollment never blocks the signed-in dashboard',async()=>{fixture.enrolled=false;await expect(signIn({},form())).rejects.toThrow('redirect:/home');});
it('never treats an unverified session as a successful member login',async()=>{fixture.user=false;expect((await signIn({},form())).error).toMatch(/session could not be verified/);});
it('rejects another domain as a login destination',async()=>{await expect(signIn({},form('https://aelio.live/account'))).rejects.toThrow('redirect:/home');});
