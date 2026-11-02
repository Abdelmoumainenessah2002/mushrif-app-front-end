import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, MousePointerClick } from "lucide-react";
import { useRef } from "react";
import { Console } from "./Console";
import { scrollTo } from "./data";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -80]);
  const rotate = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 8, 0]);

  const fade = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: d, ease },
  });

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="halo pointer-events-none absolute left-1/2 top-[38%] h-[640px] w-[900px] -translate-x-1/2" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <motion.p
          {...fade(0)}
          className="mx-auto flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
        >
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-primary" /> Project & work
          management, built with care
        </motion.p>
        <motion.h1
          {...fade(0.08)}
          className="font-display mx-auto mt-7 max-w-5xl text-center text-[2.5rem] font-medium leading-[0.95] sm:text-6xl md:text-7xl lg:text-[5.75rem]"
        >
          Every project. Every team.
          <br />
          <span className="text-shimmer italic">One clear picture.</span>
        </motion.h1>
        <motion.p
          {...fade(0.18)}
          className="mx-auto mt-6 max-w-xl text-center text-base text-muted-foreground md:text-lg"
        >
          Mushrif organizes your organization's work — workspaces, projects, epics, milestones and
          every task in between — so you always know what's happening and what comes next.
        </motion.p>
        <motion.div
          {...fade(0.26)}
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <button
            onClick={() => scrollTo("access")}
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 font-medium text-primary-foreground transition-all hover:glow-primary active:scale-[0.98] sm:w-auto"
          >
            Get Started{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={() => scrollTo("capabilities")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-6 py-3.5 font-medium transition-colors hover:border-foreground/30 hover:bg-accent sm:w-auto"
          >
            Explore the Product
          </button>
        </motion.div>

        <div
          id="product"
          className="relative mx-auto mt-16 max-w-5xl md:mt-20"
          style={{ perspective: 1400 }}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.35, ease }}
            style={{ y, rotateX: rotate }}
          >
            <Console />
          </motion.div>
          <motion.div
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground"
          >
            <MousePointerClick className="h-3.5 w-3.5 text-primary" /> Live preview — move a card,
            switch a project, change the view
          </motion.div>
        </div>
      </div>
    </section>
  );
}
