

import {getPublicSupabaseConfig} from './supabase/config';
/** Missing credentials must never create a fictional authenticated member. */
export const isSupabaseConfigured=getPublicSupabaseConfig().configured;
export const isDemoMode=process.env.NODE_ENV!=='production' && process.env.NEXT_PUBLIC_PATHD_DEMO_MODE==='true';

export function cn(...parts:Array<string|false|null|undefined>):string{return parts.filter(Boolean).join(' ');}
