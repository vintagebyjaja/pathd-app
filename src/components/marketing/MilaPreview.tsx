"use client";
import {MilaAvatar} from "@/components/companion/MilaAvatar";
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {MILA_STYLES,MILA_TOPICS,MILA_EXAMPLES,type MilaStyle,type MilaTopic} from '@/lib/companion/mila-preview';
import {isSupabaseConfigured} from '@/lib/env';
import {createSupabaseBrowserClient} from '@/lib/supabase/browser';
export function MilaPreview(){
 const [style,setStyle]=useState<MilaStyle>('Homegirl'),[topic,setTopic]=useState<MilaTopic>('Life'),[typing,setTyping]=useState(false),[member,setMember]=useState(false),[reduced,setReduced]=useState(false);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(query.matches);update();query.addEventListener('change',update);return()=>query.removeEventListener('change',update);},[]);
 useEffect(()=>{if(!isSupabaseConfigured)return;let live=true;const sb=createSupabaseBrowserClient();sb.auth.getUser().then(({data})=>{if(live)setMember(!!data.user);}).catch(()=>{});return()=>{live=false;};},[]);
 useEffect(()=>{if(reduced){setTyping(false);return;}setTyping(true);const timer=setTimeout(()=>setTyping(false),360);return()=>clearTimeout(timer);},[style,topic,reduced]);
 return <section id="meet-mila" className="mx-auto max-w-6xl px-5 py-10" aria-labelledby="mila-heading"><div className="mila-preview rounded-3xl bg-plum p-6 text-cream sm:p-8">
 <div className="grid min-w-0 items-center gap-8 md:grid-cols-2">
 <div className="min-w-0"><p className="text-sm uppercase tracking-widest">MEET MILA</p><h2 id="mila-heading" className="mt-3 font-display text-4xl">My Inspiration, Life &amp; Ambition</h2><p className="mt-4 max-w-xl text-lg">Your career matters. So does your life outside of it. Meet your supportive career, life and accountability companion.</p>
 <p className="mt-5 text-sm text-cream/80">One MILA. A style that feels right for you.</p><div className="mila-styles mt-3 flex gap-2 overflow-x-auto pb-2 md:flex-wrap" role="group" aria-label="MILA communication style">{MILA_STYLES.map(item=><button key={item} type="button" onClick={()=>setStyle(item)} aria-pressed={style===item} className={'shrink-0 rounded-full border px-4 py-2 text-sm '+(style===item?'border-peach bg-peach text-plum-deep':'border-cream/30 text-cream')}>{item}</button>)}</div>
 <p className="mt-5 text-sm text-cream/85">Explore a sample, then make your next move with MILA.</p></div>
 <div className="mila-demo min-w-0 rounded-3xl border border-cream/20 bg-cream/10 p-5"><div className="flex items-center gap-3"><MilaAvatar/><div><b>MILA</b><p className="text-xs text-cream/75">Demonstration · prewritten examples</p></div></div>
 <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Preview topic">{(Object.keys(MILA_TOPICS) as MilaTopic[]).map(item=><button key={item} type="button" aria-pressed={topic===item} onClick={()=>setTopic(item)} className={'rounded-full px-3 py-2 text-xs '+(topic===item?'bg-cream text-plum':'bg-plum/50 text-cream')}>{item}</button>)}</div>
 <div className="mila-demo-messages mt-5 grid content-start gap-3"><p className="ml-7 rounded-2xl rounded-tr-sm bg-peach p-4 text-sm text-plum-deep">{MILA_TOPICS[topic]}</p><div aria-live="polite" aria-atomic="true">{typing?<p className="mila-typing inline-flex gap-1 rounded-2xl bg-cream/15 p-4" role="status" aria-label="Loading sample"><span>•</span><span>•</span><span>•</span></p>:<p className="mila-example mr-5 rounded-2xl rounded-tl-sm bg-cream p-4 text-sm leading-relaxed text-plum-deep"><span className="mb-1 block text-xs font-semibold">MILA · {style}</span>{MILA_EXAMPLES[topic][style]}</p>}</div></div></div>
 </div><div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="font-display text-2xl">Your journey. Your MILA.</p><Link href={member?'/companion?agent=mila':'/sign-up'} className="rounded-full bg-peach px-6 py-3 font-semibold text-plum-deep">Start Your PATH</Link></div>
 </div></section>;
}
