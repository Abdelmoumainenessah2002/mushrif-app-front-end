import { motion } from "motion/react";
import { Check, Lock, Minus } from "lucide-react";
import { useState } from "react";
import { Eyebrow, Reveal } from "./Reveal";
import { roleTone, type Role } from "./data";

const PERMS = ["View organization", "Invite members", "Change roles", "Edit details", "Remove members", "Transfer ownership"];
const COLS: Role[] = ["Owner", "Admin", "Member", "Viewer"];
const DEFAULT: Record<Role, boolean[]> = {
  Owner: [true, true, true, true, true, true],
  Admin: [true, true, true, true, true, false],
  Member: [true, true, false, false, false, false],
  Viewer: [true, false, false, false, false, false],
};

export function Permissions() {
  const [m, setM] = useState(DEFAULT);
  const toggle = (r: Role, i: number) => {
    if (r === "Owner" || i === 5) return; // owner and transfer are fixed
    setM((x) => ({ ...x, [r]: x[r].map((v, j) => (j === i ? !v : v)) }));
  };
  const changed = COLS.some((r) => m[r].some((v, i) => v !== DEFAULT[r][i]));

  return (
    <section id="permissions" className="relative overflow-hidden border-t border-border bg-surface/40 py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <Reveal><Eyebrow index="02">Permissions</Eyebrow></Reveal>
          <Reveal delay={0.05}><h2 className="font-display mt-6 text-4xl font-medium leading-[1] md:text-6xl">Access that reads like a sentence.</h2></Reveal>
          <Reveal delay={0.1}><p className="mt-6 max-w-md text-muted-foreground">Every role maps to a clear set of permissions. Collaboration stays structured, and nobody can do more than their role allows.</p></Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 flex items-center gap-2 font-mono text-xs text-muted-foreground"><Lock className="h-3.5 w-3.5 text-primary" /> Owner rights and ownership transfer stay locked.</p>
            <button onClick={() => setM(DEFAULT)} disabled={!changed} className="mt-4 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:bg-accent disabled:opacity-40">Reset matrix</button>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="panel overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[520px] text-sm">
              <caption className="sr-only">Role permissions — toggle cells to try it</caption>
              <thead>
                <tr className="border-b border-border">
                  <th className="p-4 text-left font-mono text-[10px] font-normal uppercase tracking-widest text-muted-foreground">Permission</th>
                  {COLS.map((r) => <th key={r} className="p-4"><span className={`rounded-md px-2 py-0.5 font-mono text-[10px] font-normal uppercase tracking-wider ring-1 ${roleTone[r]}`}>{r}</span></th>)}
                </tr>
              </thead>
              <tbody>
                {PERMS.map((p, i) => (
                  <tr key={p} className="border-b border-border last:border-0 transition-colors hover:bg-accent/40">
                    <td className="p-4">{p}</td>
                    {COLS.map((r) => {
                      const on = m[r][i]; const locked = r === "Owner" || i === 5;
                      return (
                        <td key={r} className="p-2 text-center">
                          <button onClick={() => toggle(r, i)} disabled={locked} aria-pressed={on} aria-label={`${r}: ${p}`}
                            className={`mx-auto grid h-8 w-8 place-items-center rounded-lg border transition-all ${on ? "border-primary/40 bg-primary/15 text-primary" : "border-border text-muted-foreground"} ${locked ? "cursor-not-allowed opacity-70" : "hover:scale-110 hover:border-primary/60"}`}>
                            <motion.span key={String(on)} initial={{ scale: 0.4, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
                              {on ? <Check className="h-4 w-4" /> : <Minus className="h-3.5 w-3.5" />}
                            </motion.span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
