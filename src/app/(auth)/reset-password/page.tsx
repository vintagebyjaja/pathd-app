"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
export default function Page() {
  const [password, setPassword] = useState(""),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const sb = createSupabaseBrowserClient();
        const { error } = await sb.auth.updateUser({ password });
        if (error)
          setError(
            "The secure reset session is missing or expired. Request a new link.",
          );
        else {
          await sb.auth.signOut({ scope: "global" });
          location.assign("/sign-in");
        }
      }}
    >
      <h1 className="font-display text-3xl">Choose a new password</h1>
      <input
        aria-label="New password"
        required
        minLength={12}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="my-4 w-full rounded-xl border p-3"
      />
      <button className="rounded-xl bg-plum p-3 text-cream">
        Update password
      </button>
      <p role="alert">{error}</p>
    </form>
  );
}
