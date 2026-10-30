"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import SecuritySetup from "./SecuritySetup";
export default function SecurityGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [needs, setNeeds] = useState(false),
    [error, setError] = useState("");
  const path = usePathname();
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const check = async () => {
      const sb = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await sb.auth.getUser();
      if (!user) return;
      const { data, error } = await sb
        .schema("core")
        .from("profiles")
        .select("recovery_enrolled_at")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        setError(
          "Account security status is temporarily unavailable. Your dashboard remains accessible.",
        );
        return;
      }
      setNeeds(!data?.recovery_enrolled_at);
    };
    check();
    addEventListener("shared-recovery-enrolled", check);
    return () => removeEventListener("shared-recovery-enrolled", check);
  }, [path]);
  return (
    <>
      {error && (
        <p role="status" className="mb-4 rounded-xl bg-peach p-3">
          {error}
        </p>
      )}
      {needs && path != "/settings/security" ? <SecuritySetup /> : children}
    </>
  );
}
