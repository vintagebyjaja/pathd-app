import {describe,it,expect} from 'vitest';
import {pathdFeatureAccess} from './entitlements';
const base={configured:true,companion_access:false,pathd_plus:false,pathd_pro:false,subscriptions:[],allowances:[]};
describe('independent PATHD entitlements',()=>{
 it('preserves every existing free core capability',()=>{for(const f of ['apply','browse','resume','maps','discovery']as const)expect(pathdFeatureAccess(null,f)).toBe(true);});
 it('paid AELIO unlocks companions without granting PATHD+ or Pro',()=>{const access={...base,companion_access:true,funding_source:'aelio'};expect(pathdFeatureAccess(access,'companions')).toBe(true);expect(pathdFeatureAccess(access,'community')).toBe(false);expect(pathdFeatureAccess(access,'advanced-career')).toBe(false);});
 it('PATHD+ and AELIO stay independent',()=>{const plus={...base,pathd_plus:true};expect(pathdFeatureAccess(plus,'circles')).toBe(true);expect(pathdFeatureAccess(plus,'companions')).toBe(false);expect(pathdFeatureAccess({...plus,companion_access:true},'advanced-matching')).toBe(false);});
});
