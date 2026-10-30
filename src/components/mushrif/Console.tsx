import { AnimatePresence, motion } from "motion/react";
import { Bell, Building2, ChevronDown, Search, ShieldCheck, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PEOPLE, ROLES, initials, roleTone, type Person, type Role } from "./data";

const EVENTS = [
  { icon: UserPlus, text: "Karim Idris joined Atlas Collective", tone: "text-sky" },
  { icon: ShieldCheck, text: "Sofia Marín verified her email", tone: "text-sage" },
  { icon: Users, text: "Omar Benali was promoted to Admin", tone: "text-primary" },
  { icon: Bell, text: "Invitation sent to hana@atlas.org", tone: "text-rose" },
  { icon: ShieldCheck, text: "Password changed — sessions refreshed", tone: "text-sage" },
];

export function Avatar({ p, size = "h-8 w-8" }: { p: Pick<Person, "name" | "hue">; size?: string }) {
  return <span className={`${size} ${p.hue} grid shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold ring-2 ring-surface`}>{initials(p.name)}</span>;
}

export function RoleChip({ role }: { role: Role }) {
  return <span className={`rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ring-1 ${roleTone[role]}`}>{role}</span>;
}

export function Console() {
  const [people, setPeople] = useState(PEOPLE);
  const [editing, setEditing] = useState<string | null>(null);
  const [feed, setFeed] = useState(() => EVENTS.slice(0, 3).map((e, i) => ({ ...e, key: i })));
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 3;
    const t = setInterval(() => {
      const e = EVENTS[n % EVENTS.length];
      setFeed((f) => [{ ...e, key: n }, ...f].slice(0, 3));
      n++;
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const setRole = (id: string, role: Role) => {
    const p = people.find((x) => x.id === id)!;
    setPeople((ps) => ps.map((x) => (x.id === id ? { ...x, role } : x)));
    setEditing(null);
    setFeed((f) => [{ icon: Users, text: `${p.name} is now ${role}`, tone: "text-primary", key: Date.now() }, ...f].slice(0, 3));
  };

  const shown = people.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="panel relative overflow-hidden rounded-2xl text-left">
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-accent" /><i className="h-2.5 w-2.5 rounded-full bg-accent" /><i className="h-2.5 w-2.5 rounded-full bg-accent" /></div>
        <div className="mx-auto font-mono text-[11px] text-muted-foreground">mushrif / atlas-collective</div>
      </div>
      <div className="grid md:grid-cols-[1fr_15rem]">
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent"><Building2 className="h-5 w-5 text-primary" /></span>
            <div className="min-w-0">
              <p className="font-display text-lg font-semibold leading-tight">Atlas Collective</p>
              <p className="font-mono text-[11px] text-muted-foreground">{people.length} members · owner Layla Haddad</p>
            </div>
            <div className="ml-auto hidden -space-x-2 sm:flex">{people.slice(0, 4).map((p) => <Avatar key={p.id} p={p} size="h-7 w-7" />)}</div>
          </div>
          <label className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter members…" aria-label="Filter members" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </label>
          <ul className="mt-3 divide-y divide-border">
            {shown.map((p) => (
              <motion.li layout key={p.id} className="relative flex items-center gap-3 py-2.5">
                <Avatar p={p} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">{p.email}</p>
                </div>
                {p.role === "Owner" ? <RoleChip role="Owner" /> : (
                  <button onClick={() => setEditing(editing === p.id ? null : p.id)} aria-haspopup="listbox" aria-expanded={editing === p.id}
                    className="flex items-center gap-1 rounded-md transition-opacity hover:opacity-80" aria-label={`Change role for ${p.name}`}>
                    <motion.span key={p.role} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><RoleChip role={p.role} /></motion.span>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
                <AnimatePresence>
                  {editing === p.id && (
                    <motion.ul role="listbox" initial={{ opacity: 0, y: -6, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      className="absolute right-0 top-11 z-20 w-32 rounded-lg border border-border bg-popover p-1 shadow-2xl">
                      {ROLES.filter((r) => r !== "Owner").map((r) => (
                        <li key={r}><button role="option" aria-selected={p.role === r} onClick={() => setRole(p.id, r)} className="w-full rounded-md px-2 py-1.5 text-left text-xs hover:bg-accent">{r}</button></li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            ))}
            {shown.length === 0 && <li className="py-6 text-center text-xs text-muted-foreground">No members match “{query}”.</li>}
          </ul>
        </div>
        <aside className="border-t border-border bg-background/30 p-4 md:border-l md:border-t-0">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-sage" /> Activity
          </p>
          <ul className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {feed.map((e) => (
                <motion.li key={e.key} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="flex gap-2.5 rounded-lg border border-border bg-surface p-2.5">
                  <e.icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${e.tone}`} />
                  <span className="text-xs leading-snug">{e.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </aside>
      </div>
    </div>
  );
}
