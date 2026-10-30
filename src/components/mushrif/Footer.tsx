import { Wordmark } from "./Logo";
import { scrollTo } from "./data";

const COLS = [
  { h: "Product", l: <[string, string][]>[["Overview", "product"], ["Capabilities", "capabilities"], ["Permissions", "permissions"]] },
  { h: "Learn", l: <[string, string][]>[["How it works", "how"], ["Early access", "access"]] },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-[2fr_1fr_1fr] md:px-8">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">Organization and team management — members, roles, permissions, security and ownership.</p>
        </div>
        {COLS.map((c) => (
          <div key={c.h}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{c.h}</p>
            <ul className="mt-4 space-y-2.5">
              {c.l.map(([label, id]) => (
                <li key={id}><button onClick={() => scrollTo(id)} className="group relative text-sm">
                  {label}<span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                </button></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-border px-5 py-6 font-mono text-[11px] text-muted-foreground sm:flex-row md:px-8">
        <span>© {new Date().getFullYear()} Mushrif</span>
        <span lang="ar">مشرف — the one who oversees</span>
      </div>
    </footer>
  );
}
