"use client";
import {MilaAvatar} from "./MilaAvatar";
import {MILA_STYLES} from "@/lib/companion/mila-preview";
import ImportCareer from "./ImportCareer";
import CareerTools from "./CareerTools";
import {Markdown} from "./Markdown";
import { useState, useEffect, useRef } from "react";
async function api(path: string, method = "GET", data?: unknown) {
  const r = await fetch("/api/companion" + path, {
    method,
    headers: { "content-type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error);
  return d;
}
export default function Companions() {
  const controllers=useRef<Record<string,AbortController>>({}),attempts=useRef<Record<string,any>>({}),selection=useRef(0),follow=useRef(true),scrollBox=useRef<HTMLDivElement|null>(null);
  const [retryable,setRetryable]=useState<Record<string,boolean>>({}),[waiting,setWaiting]=useState<Record<string,boolean>>({});
  useEffect(()=>{const element=scrollBox.current;if(element&&follow.current)element.scrollTop=element.scrollHeight;});
  const [style,setStyle]=useState("homegirl"),[savingStyle,setSavingStyle]=useState(false);
  const [agents, setAgents] = useState<any[]>([]),
    [threads, setThreads] = useState<any[]>([]),
    [cur, setCur] = useState<any>(null),
    [messages, setMessages] = useState<Record<string, any[]>>({}),
    [draft, setDraft] = useState<Record<string, string>>({}),
    [error, setError] = useState(""),
    [busy, setBusy] = useState<Record<string, boolean>>({}),
    [consent, setConsent] = useState(false),
    [career, setCareer] = useState(false),
    [welcomed, setWelcomed] = useState(true);
  const box = "rounded-2xl border border-line bg-paper p-5";
  useEffect(() => {
    Promise.all([api("/agents"), api("/conversations"), api("/account")])
      .then(([a, c, p]) => {
        setStyle(p.preferences.mila_style||"homegirl");
        setAgents(a.agents);
        setThreads(c.conversations);
        setCareer(p.preferences.career_consent);
        setWelcomed(p.preferences.mila_welcomed);
        setConsent(p.preferences.external_ai_consent);
        const kind =
          new URLSearchParams(location.search).get("agent") === "aelio"
            ? "aelio"
            : "mila";
        const agent = a.agents.find((x: any) => x.kind === kind);
        if (agent) select(agent, c.conversations);
      })
      .catch((e) => setError(e.message));
  }, []);
  async function select(agent: any, list = threads) {
    const version=++selection.current;
    try {
      let c = list.find(
        (c: any) =>
          c.participants.length === 1 && c.participants[0] === agent.id,
      );
      if (!c) {
        c = (
          await api("/conversations", "POST", {
            participants: [agent.id],
            title: agent.name,
            product: "pathd",
          })
        ).conversation;
        setThreads((t) => [c, ...t]);
      }
      if(version!==selection.current)return;
      setCur(c);follow.current=true;
      if(controllers.current[c.id])return;
      const r = await api("/conversations/" + c.id + "/messages");
      if(!controllers.current[c.id])setMessages((m) => ({ ...m, [c.id]: r.messages }));
    } catch (e: any) {
      setError(e.message);
    }
  }
  async function send(e?: React.FormEvent,retry?:any) {
    e?.preventDefault();if(!cur||busy[cur.id]||!consent)return;
    const id=cur.id,content=retry?.content??draft[id]??'';if(!content.trim())return;
    const previous=attempts.current[id],retrying=!!retry||!!retryable[id]&&previous?.content===content;
    let requestId=retry?.request_id||(retrying?previous?.request_id:undefined)||crypto.randomUUID();
    const abort=new AbortController();controllers.current[id]=abort;attempts.current[id]={content,request_id:requestId};follow.current=true;
    setBusy(b=>({...b,[id]:true}));setWaiting(b=>({...b,[id]:true}));setRetryable(b=>({...b,[id]:false}));setError('');setDraft(d=>({...d,[id]:''}));
    setMessages(m=>({...m,[id]:[...(m[id]||[]).filter(message=>!retrying||message.request_id!==previous?.request_id),{id:'local-user-'+requestId,role:'user',content,request_id:requestId,local:true}]}));
    try{
      let response:Response;
      for(let index=0;;index++){
        response=await fetch('/api/companion/conversations/'+id+'/respond',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({content,consent,request_id:requestId}),signal:abort.signal});
        if(response.ok)break;const detail=await response.json();if(detail.code==='retry_new_request'&&index===0){const old=requestId;requestId=crypto.randomUUID();attempts.current[id].request_id=requestId;setMessages(m=>({...m,[id]:(m[id]||[]).map(message=>message.local&&message.request_id===old?{...message,request_id:requestId}:message)}));continue;}throw Error(detail.error||'The reply could not start.');
      }
      if(!response.body)throw Error('The reply stream is missing.');
      const reader=response.body.getReader(),decoder=new TextDecoder();let buffer='',reply='',saved=false;const key='reply-'+requestId;
      for(;;){const chunk=await reader.read();if(chunk.done)break;buffer+=decoder.decode(chunk.value,{stream:true});let boundary;while((boundary=buffer.indexOf('\n'))>=0){const line=buffer.slice(0,boundary);buffer=buffer.slice(boundary+1);if(!line.trim())continue;const event=JSON.parse(line);if(event.type==='error')throw Error(event.message);if(event.type==='saved')saved=true;if(event.type==='delta'){setWaiting(w=>({...w,[id]:false}));reply+=event.text;setMessages(m=>({...m,[id]:[...(m[id]||[]).filter(message=>message.id!==key),{id:key,role:'assistant',speaker:event.speaker,content:reply,request_id:requestId,local:true}]}));}}}
      if(!saved)throw Error('The connection ended before your reply was saved. Retry safely.');
      const stored=await api('/conversations/'+id+'/messages');setMessages(m=>({...m,[id]:stored.messages}));
    }catch(error:any){setError(error.name==='AbortError'?'Generation stopped. Your draft is available to retry.':error.message);setDraft(d=>({...d,[id]:content}));setRetryable(r=>({...r,[id]:true}));}
    finally{delete controllers.current[id];setBusy(b=>({...b,[id]:false}));setWaiting(w=>({...w,[id]:false}));}
  }
  async function stop(){const id=cur?.id;if(!id)return;controllers.current[id]?.abort();try{await api('/conversations/'+id+'/cancel','POST',{request_id:attempts.current[id]?.request_id});}catch{setError('Stopped locally. Server cancellation could not be confirmed; please wait before retrying.');}}
  return (
    <div className="grid gap-5">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-plum-soft">
          Your companions
        </p>
        <h1 className="font-display text-4xl text-plum">AELIO & MILA</h1>
        <p className="mt-3 text-plum-soft">
          One account. Two companions. Your career and your life.
        </p>
      </header>
      <nav className="flex gap-3">
        {agents.map((a) => (
          <button
            key={a.id}
            className={
              box +
              (cur?.participants.includes(a.id) ? " ring-2 ring-plum" : "")
            }
            onClick={() => select(a)}
          >
            {a.kind==='mila'&&<MilaAvatar/>}<b>{a.name}</b>
            <span className="block text-sm">
              {a.kind === "mila"
                ? "Career & life companion"
                : "Your Original Main Pal"}
            </span>
          </button>
        ))}
      </nav>
      {error && (
        <p role="alert" className="rounded-xl bg-peach p-4 text-plum-deep">
          {error}
        </p>
      )}
      {agents.find(a=>a.id===cur?.participants[0])?.kind==='mila'&&<label className={box}>MILA’s communication style<select aria-label="MILA communication style" disabled={savingStyle} value={style} onChange={async event=>{const next=event.target.value;setSavingStyle(true);try{await api('/account','PATCH',{mila_style:next});setStyle(next);}catch(e:any){setError(e.message);}finally{setSavingStyle(false);}}} className="ml-3 rounded-xl border border-line bg-paper px-3 py-2 text-plum">{MILA_STYLES.map(item=><option key={item} value={item.toLowerCase()}>{item}</option>)}</select><span className="block text-sm">Same MILA, same history. Choose how you like to talk.</span></label>}
      <section className={box}>
        <h2 className="text-2xl font-semibold">
          {cur?.title || "Choose your companion"}
        </h2>
        <p className="text-sm text-plum-soft">
          {agents.find((a) => a.id === cur?.participants[0])?.kind === "mila"
            ? welcomed
              ? "Your career matters. So does your life outside of it."
              : "MILA — My Inspiration, Life & Ambition. Your homegirl who wants to see you win."
            : "AELIO adapts to your energy. Your general conversations stay separate from MILA."}
        </p>
        {!welcomed && (
          <button
            className="mt-2 underline"
            onClick={() => {
              api("/account", "PATCH", { mila_welcomed: true })
                .then(() => setWelcomed(true))
                .catch((e) => setError(e.message));
            }}
          >
            Got it — skip introduction
          </button>
        )}
        <div
          className="my-5 grid max-h-[55vh] gap-3 overflow-auto" ref={scrollBox} onScroll={()=>{const element=scrollBox.current;if(element)follow.current=element.scrollHeight-element.scrollTop-element.clientHeight<100;}}
          aria-live="polite"
        >
          {(messages[cur?.id] || []).map((m, i) => (
            <article
              key={m.id || i}
              className={
                "max-w-[90%] whitespace-pre-wrap rounded-2xl p-4 " +
                (m.role === "user"
                  ? "ml-auto bg-plum text-cream"
                  : "bg-lavender-wash text-plum-deep")
              }
            >
              <b className="flex items-center gap-2 text-xs">{m.role==='assistant'&&(m.speaker==='MILA'||(!m.speaker&&agents.find(a=>a.id===cur?.participants[0])?.kind==='mila'))&&<MilaAvatar size={24}/>} {m.speaker || m.role}</b>
              <Markdown text={m.content}/>
            </article>
          ))}
        </div>
        <label className="block text-sm">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              api("/account", "PATCH", {
                external_ai_consent: e.target.checked,
              }).catch((e) => setError(e.message));
            }}
          />{" "}
          I agree to external AI processing. Replies may be inaccurate.
        </label>
        {busy[cur?.id]&&waiting[cur?.id]&&<p role="status" className="text-sm text-plum-soft">Thinking…</p>}
        {busy[cur?.id]&&<button type="button" className="text-sm underline" onClick={stop}>Stop generation</button>}
        {!busy[cur?.id]&&retryable[cur?.id]&&<button type="button" className="text-sm underline" onClick={()=>send(undefined,attempts.current[cur.id])}>Retry response</button>}
        <form className="mt-4 flex gap-2" onSubmit={send}>
          <textarea
            aria-label="Message companion" maxLength={8000}
            className="min-w-0 flex-1 rounded-xl border border-line p-3 text-plum"
            value={draft[cur?.id] || ""}
            onChange={(e) =>
              setDraft((d) => ({ ...d, [cur?.id]: e.target.value }))
            }
            placeholder={"Message " + (cur?.title || "your companion")}
          />
          <button
            disabled={!cur || busy[cur.id] || !consent}
            className="rounded-xl bg-plum px-5 text-cream"
          >
            {busy[cur?.id] ? "Writing…" : "Send"}
          </button>
        </form>
      </section>
      <label className={box}>
        <input
          type="checkbox"
          checked={career}
          onChange={(e) => {
            setCareer(e.target.checked);
            api("/account", "PATCH", {
              career_consent: e.target.checked,
            }).catch((e) => setError(e.message));
          }}
        />{" "}
        Allow MILA to use my authorized PATHD career context. General AELIO chat
        stays independent unless I separately allow sharing.
      </label>
      <ImportCareer />
      <CareerTools />
      <p>
        <a href="/settings/security" className="underline">
          Account security
        </a>{" "}
        ·{" "}
        <a href="https://aelio.live/chat/?companion=mila" className="underline">
          Open MILA on AELIO
        </a>
      </p>
    </div>
  );
}
