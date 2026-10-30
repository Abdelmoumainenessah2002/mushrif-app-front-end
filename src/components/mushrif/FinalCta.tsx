import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Info } from "lucide-react";
import { useState, type FormEvent } from "react";
import { LogoMark } from "./Logo";
import { SIGNUP_URL } from "./data";

export function FinalCta() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "noted">("idle");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setState("error");
    if (SIGNUP_URL) { window.location.href = `${SIGNUP_URL}?email=${encodeURIComponent(email)}`; return; }
    setState("noted");
  };

  return (
    <section id="access" className="relative overflow-hidden border-t border-border py-28 md:py-44">
      <div className="grid-lines pointer-events-none absolute inset-0" />
      <div className="halo pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2" />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8, rotate: -8 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 160, damping: 16 }} className="mx-auto w-fit">
          <LogoMark className="h-14 w-14" />
        </motion.div>
        <h2 className="font-display mt-8 text-5xl font-medium leading-[0.95] md:text-7xl">Give your team<br /><span className="italic text-primary">a steady hand.</span></h2>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground">Mushrif is in active development. Leave your email to be among the first to try it.</p>
        <AnimatePresence mode="wait">
          {state !== "noted" ? (
            <motion.form key="f" exit={{ opacity: 0, y: -8 }} onSubmit={submit} noValidate className="mx-auto mt-10 flex max-w-md flex-col gap-2 rounded-2xl border border-border bg-surface p-1.5 sm:flex-row sm:rounded-full">
              <label htmlFor="cta-email" className="sr-only">Email address</label>
              <input id="cta-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setState("idle"); }} placeholder="you@organization.com" aria-invalid={state === "error"} aria-describedby="cta-msg"
                className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground" />
              <button className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-shadow hover:glow-primary">
                Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.form>
          ) : (
            <motion.div key="n" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 max-w-md rounded-2xl border border-primary/30 bg-primary/5 p-5 text-left">
              <p className="flex items-start gap-3 text-sm"><Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Thanks — this is a preview, so <b>{email}</b> wasn't sent anywhere and no account was created. Sign-up opens when Mushrif launches.</span></p>
              <button onClick={() => { setEmail(""); setState("idle"); }} className="mt-3 text-xs text-primary hover:underline">Use another email</button>
            </motion.div>
          )}
        </AnimatePresence>
        <p id="cta-msg" role="status" className="mt-3 h-5 text-xs text-rose">{state === "error" ? "Please enter a valid email address." : ""}</p>
      </div>
    </section>
  );
}
