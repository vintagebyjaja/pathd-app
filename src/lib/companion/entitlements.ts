export type CompanionAccess={configured:boolean;companion_access:boolean;funding_source?:string|null;pathd_plus:boolean;pathd_pro:boolean;subscriptions:any[];allowances:any[]};
// Free job applications, browsing, resumes, maps and discovery never require paid access.
export function pathdFeatureAccess(access:CompanionAccess|null,feature:'apply'|'browse'|'resume'|'maps'|'discovery'|'community'|'circles'|'messaging'|'advanced-discovery'|'advanced-career'|'advanced-matching'|'companions'){
 if(['apply','browse','resume','maps','discovery'].includes(feature))return true;
 if(feature==='companions')return access?.companion_access===true;
 if(['community','circles','messaging','advanced-discovery'].includes(feature))return access?.pathd_plus===true;
 return access?.pathd_pro===true;
}
