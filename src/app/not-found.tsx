import { LinkButton } from "@/components/ui/Button";
import { PathdMark } from "@/components/brand/Logo";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <PathdMark className="mx-auto h-14 w-14" />
        <h1 className="mt-6 font-display text-4xl text-plum">This path doesn&apos;t lead anywhere</h1>
        <p className="mt-3 text-plum-soft">The page may have moved, or the listing may have closed.</p>
        <LinkButton href="/jobs" variant="action" className="mt-8">Browse jobs</LinkButton>
      </div>
    </main>
  );
}
