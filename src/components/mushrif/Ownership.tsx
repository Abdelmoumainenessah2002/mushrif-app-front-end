import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Crown, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Eyebrow, Reveal } from "./Reveal";
import { Avatar } from "./Console";
import { PEOPLE } from "./data";

export function Ownership() {
  const candidates = PEOPLE.filter((p) => p.role === "Admin" || p.role === "Member");
  const [owner, setOwner] = useState(PEOPLE[0]!);
  const [target, setTarget] = useState(candidates[0]!.id);
  const [stage, setStage] = useState<"idle" | "confirm" | "done">("idle");
  const to = PEOPLE.find((p) => p.id === target)!;

  return (
    <section className="border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal><Eyebrow index="03">Ownership</Eyebrow></Reveal>
        <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-end">
          <Reveal delay={0.05}><h2 className="font-display text-4xl font-medium leading-[1] md:text-6xl">Hand over the keys,<br /><span className="italic text-primary">deliberately.</span></h2></Reveal>
          <Reveal delay={0.1}><p className="max-w-md text-muted-foreground lg:justify-self-end">People move on. Mushrif makes ownership transfer an explicit, confirmed step — so an organization is never left without someone responsible for it.</p></Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="panel mt-14 rounded-2xl p-5 sm:p-8">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
              <div className="rounded-xl border border-border p-5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Current owner</p>
                <AnimatePresence mode="wait">
                  <motion.div key={owner.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mt-4 flex items-center gap-3">
                    <Avatar p={owner} size="h-11 w-11" />
                    <div><p className="font-medium">{owner.name}</p><p className="flex items-center gap-1 font-mono text-[11px] text-primary"><Crown className="h-3 w-3" /> Owner</p></div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="relative mx-auto flex h-10 w-full items-center md:w-28">
                <span className="h-px w-full bg-border" />
                <motion.span className="absolute left-0 h-px bg-primary" animate={{ width: stage === "idle" ? "0%" : "100%" }} transition={{ duration: 0.8 }} />
                <ArrowRight className="absolute right-0 h-4 w-4 translate-x-1/2 text-primary md:right-0" />
              </div>
              <div className="rounded-xl border border-border p-5">
                <label htmlFor="new-owner" className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">New owner</label>
                <select id="new-owner" value={target} disabled={stage !== "idle"} onChange={(e) => setTarget(e.target.value)}
                  className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60">
                  {candidates.filter((c) => c.id !== owner.id).concat(owner.id !== PEOPLE[0]!.id ? [PEOPLE[0]!] : []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-8 flex min-h-12 flex-wrap items-center gap-3 border-t border-border pt-6">
              <AnimatePresence mode="wait">
                {stage === "idle" && (
                  <motion.button key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setStage("confirm")} className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-shadow hover:glow-primary">Request transfer</motion.button>
                )}
                {stage === "confirm" && (
                  <motion.div key="b" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-3">
                    <p className="text-sm">Transfer <b>Atlas Collective</b> to {to.name}?</p>
                    <button onClick={() => { setOwner(to); setTarget(owner.id); setStage("done"); }} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Confirm</button>
                    <button onClick={() => setStage("idle")} className="rounded-full border border-border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
                  </motion.div>
                )}
                {stage === "done" && (
                  <motion.div key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-sage">✓ {owner.name} now owns the organization. Everyone was notified.</p>
                    <button onClick={() => setStage("idle")} className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs hover:bg-accent"><RotateCcw className="h-3 w-3" /> Try again</button>
                  </motion.div>
                )}
              </AnimatePresence>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">Interactive demo</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
