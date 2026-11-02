import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { Eyebrow, Reveal } from "./Reveal";

const STEPS = [
  { n: "I", t: "Found", d: "Create your organization and carve it into workspaces — one per product, department or client." },
  { n: "II", t: "Shape", d: "Open a project, give it a key, and frame the work with epics and milestones." },
  { n: "III", t: "Deliver", d: "Break the work into tasks, stories and bugs, assign them, and watch them move to done." },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const h = useTransform(scrollYProgress, [0, 1], reduce ? ["100%", "100%"] : ["0%", "100%"]);

  return (
    <section id="how" className="border-t border-border bg-surface/40 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal><Eyebrow index="03">How it works</Eyebrow></Reveal>
        <Reveal delay={0.05}><h2 className="font-display mt-6 max-w-3xl text-4xl font-medium leading-[1] md:text-6xl">Three verbs. One steady organization.</h2></Reveal>
        <div ref={ref} className="relative mt-16 md:ml-[8%]">
          <div className="absolute bottom-0 left-[15px] top-0 w-px bg-border md:left-[23px]"><motion.div className="w-full bg-primary" style={{ height: h }} /></div>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05} className="relative grid grid-cols-[2rem_1fr] gap-6 pb-16 last:pb-0 md:grid-cols-[3rem_1fr_1.2fr] md:gap-10">
              <span className="relative z-10 mt-2 grid h-8 w-8 place-items-center rounded-full border border-primary/50 bg-background font-mono text-[10px] text-primary md:h-12 md:w-12 md:text-xs">{s.n}</span>
              <h3 className="font-display text-5xl font-medium md:text-8xl">{s.t}<span className="text-primary">.</span></h3>
              <p className="col-start-2 max-w-md text-muted-foreground md:col-start-3 md:mt-6">{s.d}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
