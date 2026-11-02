import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";
import { scrollTo } from "./data";

const LINKS = [
  { id: "product", label: "Product" },
  { id: "capabilities", label: "Capabilities" },
  { id: "structure", label: "Structure" },
  { id: "how", label: "How it works" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const go = (id: string) => { setOpen(false); setTimeout(() => scrollTo(id), open ? 250 : 0); };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-border bg-background/75 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8" aria-label="Main">
        <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Mushrif home">
          <Wordmark />
        </a>
        <ul className="hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
          {LINKS.map((l) => (
            <li key={l.id} className="relative">
              <button onClick={() => go(l.id)} onMouseEnter={() => setHover(l.id)} onFocus={() => setHover(l.id)}
                className="relative z-10 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {l.label}
              </button>
              {hover === l.id && (
                <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
              )}
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <button onClick={() => go("access")} className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-shadow hover:glow-primary">
            Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
        <button className="rounded-full p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={open ? "x" : "m"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} className="block">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-x-0 top-16 h-[calc(100dvh-4rem)] bg-background px-6 pt-8 md:hidden">
            <ul className="space-y-1">
              {LINKS.map((l, i) => (
                <motion.li key={l.id} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.05 }}>
                  <button onClick={() => go(l.id)} className="flex w-full items-baseline gap-4 border-b border-border py-4 text-left">
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    <span className="font-display text-3xl">{l.label}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onClick={() => go("access")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 font-medium text-primary-foreground">
              Get Started <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
