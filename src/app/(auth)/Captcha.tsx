"use client";
import { useEffect } from "react";
export default function Captcha() {
  useEffect(() => {
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) return;
    let live = true;
    const render = () => {
      const w = window as any;
      if (live && w.turnstile) {
        const host = document.getElementById("pathd-captcha");
        if (host) {
          host.innerHTML = "";
          w.turnstile.render(host, {
            sitekey,
            callback: (token: string) => {
              const el = document.getElementById(
                "captcha-token",
              ) as HTMLInputElement;
              if (el) el.value = token;
            },
            "expired-callback": () => {
              const el = document.getElementById(
                "captcha-token",
              ) as HTMLInputElement;
              if (el) el.value = "";
            },
          });
        }
      }
    };
    let script = document.querySelector(
      "script[data-pathd-captcha]",
    ) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.dataset.pathdCaptcha = "1";
      script.onload = render;
      document.head.appendChild(script);
    } else render();
    return () => {
      live = false;
    };
  }, []);
  return (
    <>
      <input id="captcha-token" name="captcha-token" type="hidden" />
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && <div id="pathd-captcha" />}
    </>
  );
}
