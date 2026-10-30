import { AnimatePresence, motion } from "motion/react";
import { Bell, Building2, KeyRound, MailCheck, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Eyebrow, Reveal } from "./Reveal";
import { Avatar, RoleChip } from "./Console";
import { PEOPLE } from "./data";

const TABS = [
  { id: "org", icon: Building2, label: "Organizations", title: "One home for every organization.", body: "Create organizations, describe them, and keep their details current. Each one has a clear owner and its own membership." },
  { id: "members", icon: Users, label: "Members & roles", title: "Know who is in — and in what capacity.", body: "Invite people, assign roles, and see the whole team at a glance. Roles carry meaning, not just labels." },
  { id: "security", icon: MailCheck, label: "Account security", title: "Trust starts with a verified email.", body: "Accounts are confirmed by email and protected by secure sign-in, so the people in your organization are who they say they are." },
  { id: "notify", icon: Bell, label: "Notifications", title: "The moments that matter, surfaced.", body: "Joins, role changes, invitations and ownership events arrive as clear, readable notifications." },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Stage({ children }: { children: ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 16, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 p-5 sm:p-7">{children}</motion.div>;
}

function OrgDemo() {
  const [name, setName] = useState("Atlas Collective");
  return (
    <Stage>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Organization profile</p>
      <label className="mt-4 block text-xs text-muted-foreground" htmlFor="org-name">Name</label>
      <input id="org-name" value={name} maxLength={32} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary" />
      <div className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-background/40 p-4">
        <span className="font-display grid h-14 w-14 place-items-center rounded-xl bg-primary text-2xl font-semibold text-primary-foreground">{(name.trim()[0] || "?").toUpperCase()}</span>
        <div className="min-w-0">
          <p className="font-display truncate text-xl">{name || "Untitled"}</p>
          <p className="font-mono text-[11px] text-muted-foreground">mushrif.app/{(name || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, "-")}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">Type a name — the preview updates instantly.</p>
    </Stage>
  );
}

function MembersDemo() {
  const [invited, setInvited] = useState<string[]>([]);
  const pool = ["Hana Okafor", "Yusuf Amrani", "Elena Rossi"];
  const next = pool[invited.length];
  return (
    <Stage>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{PEOPLE.length + invited.length} members</p>
        <button disabled={!next} onClick={() => next && setInvited((i) => [...i, next])} className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity disabled:opacity-40">
          {next ? `Invite ${next.split(" ")[0]}` : "All invited"}
        </button>
      </div>
      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {invited.map((n) => (
            <motion.li key={n} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex items-center gap-3 overflow-hidden rounded-lg border border-primary/30 bg-primary/5 px-3 py-2">
              <Avatar p={{ name: n, hue: "bg-accent text-foreground" }} size="h-7 w-7" />
              <span className="flex-1 text-sm">{n}</span>
              <span className="font-mono text-[10px] text-primary">Invited</span>
            </motion.li>
          ))}
        </AnimatePresence>
        {PEOPLE.slice(0, 4 - Math.min(invited.length, 2)).map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2">
            <Avatar p={p} size="h-7 w-7" /><span className="flex-1 text-sm">{p.name}</span><RoleChip role={p.role} />
          </li>
        ))}
      </ul>
    </Stage>
  );
}

function SecurityDemo() {
  const [step, setStep] = useState(0);
  const steps = ["Account created", "Verification email sent", "Email verified"];
  return (
    <Stage>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">sofia@atlas.org</p>
      <ol className="mt-5 space-y-0">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-4">
            <div className="flex flex-col items-center">
              <motion.span animate={{ scale: i <= step ? 1 : 0.85 }} className={`grid h-7 w-7 place-items-center rounded-full border font-mono text-[11px] transition-colors ${i <= step ? "border-sage bg-sage text-background" : "border-border text-muted-foreground"}`}>{i + 1}</motion.span>
              {i < steps.length - 1 && <span className="relative h-10 w-px bg-border"><motion.span className="absolute inset-x-0 top-0 bg-sage" animate={{ height: i < step ? "100%" : "0%" }} /></span>}
            </div>
            <p className={`pt-1 text-sm transition-colors ${i <= step ? "" : "text-muted-foreground"}`}>{s}</p>
          </li>
        ))}
      </ol>
      <button onClick={() => setStep((s) => (s + 1) % 3)} className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs transition-colors hover:bg-accent">
        <KeyRound className="h-3.5 w-3.5 text-sage" /> {step === 2 ? "Reset demo" : step === 0 ? "Send verification" : "Open link & verify"}
      </button>
    </Stage>
  );
}

function NotifyDemo() {
  const all = [
    { t: "Omar Benali changed Karim's role to Member", c: "Roles" },
    { t: "Hana Okafor accepted your invitation", c: "Members" },
    { t: "Ownership transfer requested by Layla", c: "Ownership" },
    { t: "New sign-in confirmed for your account", c: "Security" },
  ];
  const [read, setRead] = useState<number[]>([]);
  return (
    <Stage>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{all.length - read.length} unread</p>
        <button onClick={() => setRead(read.length === all.length ? [] : all.map((_, i) => i))} className="text-xs text-primary hover:underline">{read.length === all.length ? "Mark all unread" : "Mark all read"}</button>
      </div>
      <ul className="mt-4 space-y-2">
        {all.map((n, i) => {
          const r = read.includes(i);
          return (
            <li key={i}><button onClick={() => setRead((x) => (r ? x.filter((y) => y !== i) : [...x, i]))} className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${r ? "border-border opacity-50" : "border-border bg-surface-2 hover:border-primary/40"}`}>
              <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${r ? "bg-transparent" : "bg-primary"}`} />
              <span className="flex-1 text-sm">{n.t}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{n.c}</span>
            </button></li>
          );
        })}
      </ul>
    </Stage>
  );
}

const DEMOS: Record<TabId, () => ReactNode> = { org: OrgDemo, members: MembersDemo, security: SecurityDemo, notify: NotifyDemo };

export function Capabilities() {
  const [tab, setTab] = useState<TabId>("org");
  const active = TABS.find((t) => t.id === tab)!;
  const Demo = DEMOS[tab];
  return (
    <section id="capabilities" className="relative border-t border-border py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal><Eyebrow index="01">Capabilities</Eyebrow></Reveal>
        <Reveal delay={0.05}><h2 className="font-display mt-6 max-w-3xl text-4xl font-medium leading-[1] md:text-6xl">Structure, without the bureaucracy.</h2></Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[22rem_1fr] lg:gap-16">
          <div role="tablist" aria-label="Capabilities" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {TABS.map((t, i) => {
              const on = t.id === tab;
              return (
                <button key={t.id} role="tab" aria-selected={on} aria-controls="cap-panel" onClick={() => setTab(t.id)}
                  onKeyDown={(e) => { if (["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"].includes(e.key)) { e.preventDefault(); const d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1; setTab(TABS[(i + d + TABS.length) % TABS.length]!.id); } }}
                  className={`relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-colors lg:py-4 ${on ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {on && <motion.span layoutId="cap-tab" className="absolute inset-0 rounded-xl border border-border bg-surface" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                  <span className="relative font-mono text-[11px] text-primary">0{i + 1}</span>
                  <t.icon className="relative h-4 w-4" />
                  <span className="relative whitespace-nowrap text-sm font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>
          <div id="cap-panel" role="tabpanel" className="grid gap-8 md:grid-cols-[1fr_1.2fr] md:items-center">
            <AnimatePresence mode="wait">
              <motion.div key={tab} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }} transition={{ duration: 0.35 }}>
                <h3 className="font-display text-3xl leading-tight md:text-4xl">{active.title}</h3>
                <p className="mt-4 text-muted-foreground">{active.body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="panel relative h-[380px] overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait"><Demo key={tab} /></AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


