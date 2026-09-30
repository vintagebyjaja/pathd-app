import Image from "next/image";
import Link from "next/link";
import { PathdWordmark } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh md:grid-cols-2">
      <aside className="hidden items-center justify-center bg-[#f6eee1] p-10 md:flex">
        <Image src="/brand/pathd-logo.png" alt="PATHD logo" width={520} height={520} priority className="max-w-full" />
      </aside>
      <main id="main" className="flex flex-col px-6 py-8" style={{ paddingTop: "max(2rem, env(safe-area-inset-top, 0px))" }}>
        <Link href="/" aria-label="PATHD home" className="self-start">
          <PathdWordmark />
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">{children}</div>
      </main>
    </div>
  );
}
