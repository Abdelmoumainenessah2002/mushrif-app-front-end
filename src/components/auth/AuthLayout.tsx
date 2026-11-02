import { Link } from "@tanstack/react-router";
import { motion, MotionConfig, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowUpRight, Layers, Check } from "lucide-react";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/mushrif/Logo";
import { ORG, STATUS_LABEL, STATUS_TONE } from "@/components/mushrif/data";

export function AuthLayout({ children, recovery = false }: { children: ReactNode; recovery?: boolean }) {
  const reduced = useReducedMotion();
  const project = ORG.workspaces[0]?.projects[0];
  return (
    <MotionConfig reducedMotion="user">
      <div className="grain relative min-h-screen bg-background">
        <header className="relative z-10 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-7 md:px-12">
          <Link to="/" aria-label="Mushrif homepage"><Wordmark /></Link>
          <Link to={recovery ? "/login" : "/"} className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" />{recovery ? "Back to sign in" : "Back to home"}</Link>
        </header>
        <main className="mx-auto grid max-w-[1440px] lg:min-h-[calc(100svh-104px)] lg:grid-cols-2">
          <motion.div initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col justify-center px-6 pb-12 pt-10 sm:px-12 lg:pb-20 lg:pt-8">
            <div className="mx-auto w-full max-w-[400px]">{children}</div>
            <p className="mx-auto mt-10 w-full max-w-[400px] border-t border-border pt-5 font-mono text-[10px] uppercase tracking-normal text-muted-foreground">Mushrif · Project & work management</p>
          </motion.div>
          <aside className="relative hidden overflow-hidden border-l border-border bg-surface/40 px-12 py-14 lg:flex lg:flex-col lg:justify-center xl:px-16">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" />
            <motion.div initial={reduced ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.12 }} className="relative mx-auto w-full max-w-lg">
              <p className="mb-7 flex items-center gap-3 font-mono text-xs text-primary"><span className="h-px w-8 bg-primary" /> ONE CLEAR PICTURE</p>
              <h2 className="font-display text-5xl font-medium leading-[1.08] tracking-normal">Great work starts<br />with <span className="italic text-primary">clarity.</span></h2>
              <p className="mt-6 max-w-sm text-base leading-relaxed text-muted-foreground">Projects, people, and every task in between. A shared place for the work that matters.</p>
              {project && <div className="mt-14 border-y border-border py-5">
                <div className="mb-6 flex items-center justify-between"><div className="flex items-center gap-3"><Layers className="size-5 text-primary" /><div><p className="text-sm font-medium">{project.name}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{ORG.workspaces[0]?.name} / {project.key}</p></div></div><span className="font-mono text-[10px] text-muted-foreground">ILLUSTRATIVE</span></div>
                {project.items.slice(0, 3).map((item) => <div key={item.id} className="flex items-center gap-3 border-t border-border py-4"><span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-sage"><Check className="size-3" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm">{item.title}</p><p className="mt-1 font-mono text-[10px] text-muted-foreground">{item.key}</p></div><span className={`shrink-0 text-xs ${STATUS_TONE[item.status]}`}>{STATUS_LABEL[item.status]}</span></div>)}
              </div>}
              <Link to="/" className="mt-7 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">Explore Mushrif<ArrowUpRight className="size-4" /></Link>
            </motion.div>
          </aside>
        </main>
      </div>
    </MotionConfig>
  );
}