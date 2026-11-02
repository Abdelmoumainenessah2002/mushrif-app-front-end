import { AnimatePresence, motion } from "motion/react";
import { Columns3, FileText, Image as ImageIcon, Layers, Link2, List, MessageSquare, Send, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Eyebrow, Reveal } from "./Reveal";
import { Avatar, TypeChip } from "./Console";
import {
  ORG,
  STATUSES,
  STATUS_BAR,
  STATUS_LABEL,
  STATUS_TONE,
  MILESTONE_TONE,
  epicProgress,
  personById,
  type MilestoneStatus,
} from "./data";

const TABS = [
  { id: "views", icon: Columns3, label: "Boards & views", title: "The same work, seen the way you think.", body: "Kanban for flow, a list for detail, a timeline for dates. Each workspace remembers the view its team prefers." },
  { id: "epics", icon: Layers, label: "Epics & milestones", title: "Big arcs, honest dates.", body: "Group work items into epics and pin them to milestones. Progress fills in as the work gets done — no separate reporting step." },
  { id: "teams", icon: Users, label: "Teams & assignment", title: "Every item has a name next to it.", body: "Teams live inside workspaces. Assign work, spot who is overloaded, and keep responsibility visible at a glance." },
  { id: "discuss", icon: MessageSquare, label: "Discussion & files", title: "The conversation stays with the work.", body: "Threaded comments and attachments live on the work item itself — decisions stop getting lost in chat logs." },
] as const;

type TabId = (typeof TABS)[number]["id"];

const ATLAS = ORG.workspaces[0]!.projects[0]!;

function Stage({ children }: { children: ReactNode }) {
  return <motion.div initial={{ opacity: 0, y: 16, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 overflow-y-auto p-5 sm:p-6">{children}</motion.div>;
}

/* ---- Boards & views: the same six items as board, list or timeline ---- */
function ViewsDemo() {
  const [view, setView] = useState<"board" | "list" | "timeline">("board");
  const items = ATLAS.items.slice(0, 6);
  const VIEWS = [
    { id: "board", icon: Columns3, label: "Board" },
    { id: "list", icon: List, label: "List" },
    { id: "timeline", icon: List, label: "Timeline" },
  ] as const;
  return (
    <Stage>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ATLAS · 6 of {ATLAS.items.length} items</p>
        <div className="flex rounded-full border border-border p-0.5">
          {VIEWS.map((v) => (
            <button key={v.id} onClick={() => setView(v.id)} aria-pressed={view === v.id}
              className={`rounded-full px-2.5 py-1 font-mono text-[10px] transition-colors ${view === v.id ? "bg-accent text-foreground" : "text-muted-foreground"}`}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-4">
          {view === "board" && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STATUSES.map((s) => (
                <div key={s} className="rounded-lg border border-border/60 bg-background/30 p-1.5">
                  <p className={`px-1 pb-1.5 font-mono text-[9px] uppercase tracking-widest ${STATUS_TONE[s]}`}>{STATUS_LABEL[s]}</p>
                  {items.filter((i) => i.status === s).map((i) => (
                    <p key={i.id} className="mb-1 truncate rounded border border-border bg-surface px-1.5 py-1 text-[10px]">{i.title}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
          {view === "list" && (
            <ul className="divide-y divide-border rounded-lg border border-border">
              {items.map((i) => (
                <li key={i.id} className="flex items-center gap-2 px-3 py-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{i.key}</span>
                  <span className="flex-1 truncate text-xs">{i.title}</span>
                  <span className={`font-mono text-[9px] uppercase ${STATUS_TONE[i.status]}`}>{STATUS_LABEL[i.status]}</span>
                </li>
              ))}
            </ul>
          )}
          {view === "timeline" && (
            <div className="relative rounded-lg border border-border p-3">
              <span className="absolute bottom-2 left-[45%] top-2 w-px bg-primary/60" />
              <span className="absolute -top-0.5 left-[45%] -translate-x-1/2 font-mono text-[8px] uppercase text-primary">today</span>
              {items.map((i, idx) => (
                <div key={i.id} className="mb-2 flex items-center gap-2 last:mb-0">
                  <span className="w-24 shrink-0 truncate font-mono text-[9px] text-muted-foreground">{i.key}</span>
                  <div className="relative h-4 flex-1">
                    <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: idx * 0.05, duration: 0.4 }}
                      className={`absolute top-0 h-4 origin-left rounded ${STATUS_BAR[i.status]}`}
                      style={{ left: `${(idx % 4) * 14 + 4}%`, width: `${22 + (i.estimate ?? 3) * 2}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Stage>
  );
}

/* ---- Epics & milestones: progress from real item counts ---- */
function EpicsDemo() {
  const [ms, setMs] = useState(ATLAS.milestones);
  const NEXT_MS: Record<MilestoneStatus, MilestoneStatus> = { UPCOMING: "IN_PROGRESS", IN_PROGRESS: "COMPLETED", COMPLETED: "UPCOMING", MISSED: "UPCOMING", ARCHIVED: "UPCOMING" };
  return (
    <Stage>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ATLAS · epics</p>
      <ul className="mt-3 space-y-3">
        {ATLAS.epics.map((e) => {
          const p = epicProgress(ATLAS, e.id);
          return (
            <li key={e.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="flex-1 text-sm font-medium">{e.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{p.done}/{p.total} done</span>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                <motion.span className="block h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Milestones — click to advance</p>
      <ul className="mt-3 space-y-2">
        {ms.map((m) => (
          <li key={m.id}>
            <button onClick={() => setMs((x) => x.map((y) => (y.id === m.id ? { ...y, status: NEXT_MS[y.status] } : y)))}
              className="flex w-full items-center gap-3 rounded-lg border border-border px-3 py-2 text-left transition-colors hover:border-primary/40">
              <span className="flex-1 text-sm">{m.name}</span>
              <span className="font-mono text-[10px] text-muted-foreground">{m.due}</span>
              <motion.span key={m.status} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={`rounded-md px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ring-1 ${MILESTONE_TONE[m.status]}`}>{m.status.replace("_", " ")}</motion.span>
            </button>
          </li>
        ))}
      </ul>
    </Stage>
  );
}

/* ---- Teams & assignment: workload across the workspace ---- */
function TeamsDemo() {
  const team = ORG.workspaces[0]!.teams[0]!; // Platform
  const allItems = ORG.workspaces.flatMap((w) => w.projects).flatMap((p) => p.items);
  const unassigned = allItems.find((i) => i.assigneeId === null)!; // NOMAD-4
  const [assignee, setAssignee] = useState<string | null>(null);
  const load = (id: string) =>
    allItems.filter((i) => i.assigneeId === id && i.status !== "DONE").length + (assignee === id ? 1 : 0);
  const max = Math.max(...team.memberIds.map(load), 1);
  return (
    <Stage>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{team.name} team · open work</p>
      <ul className="mt-3 space-y-2.5">
        {team.memberIds.map((id) => {
          const p = personById(id);
          const n = load(id);
          return (
            <li key={id} className="flex items-center gap-3">
              <Avatar p={p} size="h-7 w-7" />
              <span className="w-24 truncate text-sm">{p.name.split(" ")[0]}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.span className={`block h-full ${n >= 4 ? "bg-rose" : "bg-sky"}`} animate={{ width: `${(n / max) * 100}%` }} transition={{ duration: 0.5 }} />
              </div>
              <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">{n} items</span>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 rounded-lg border border-dashed border-border p-3">
        <div className="flex items-center gap-2">
          <TypeChip t={unassigned.type} />
          <span className="font-mono text-[10px] text-muted-foreground">{unassigned.key}</span>
          <span className="flex-1 truncate text-sm">{unassigned.title}</span>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <button onClick={() => setAssignee(team.memberIds[(team.memberIds.indexOf(assignee ?? "") + 1) % team.memberIds.length]!)}
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90">
            {assignee ? "Reassign" : "Assign"}
          </button>
          <AnimatePresence mode="wait">
            {assignee && (
              <motion.span key={assignee} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Avatar p={personById(assignee)} size="h-5 w-5" /> {personById(assignee).name}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Stage>
  );
}

/* ---- Discussion & files: threaded comments + attachments on one item ---- */
function DiscussDemo() {
  const item = ATLAS.items.find((i) => i.key === "ATLAS-4")!;
  const [comments, setComments] = useState(item.comments ?? []);
  const [draft, setDraft] = useState("");
  const ATT_ICON = { FILE: FileText, IMAGE: ImageIcon, LINK: Link2 } as const;
  const post = () => {
    if (!draft.trim()) return;
    setComments((c) => [...c, { id: `c${Date.now()}`, authorId: "p1", content: draft.trim(), at: "now" }]);
    setDraft("");
  };
  return (
    <Stage>
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-muted-foreground">{item.key}</span>
        <TypeChip t={item.type} />
        <span className={`ml-auto font-mono text-[9px] uppercase ${STATUS_TONE[item.status]}`}>{STATUS_LABEL[item.status]}</span>
      </div>
      <p className="mt-1.5 text-sm font-medium">{item.title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.attachments!.map((a) => {
          const Icon = ATT_ICON[a.type];
          return <span key={a.id} className="flex items-center gap-1 rounded-md border border-border px-2 py-1 font-mono text-[9px] text-muted-foreground"><Icon className="h-3 w-3 text-sky" />{a.name}</span>;
        })}
      </div>
      <ul className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {comments.map((c) => (
            <motion.li key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex gap-2.5">
                <Avatar p={personById(c.authorId)} size="h-6 w-6" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px]"><span className="font-medium">{personById(c.authorId).name}</span> <span className="font-mono text-[9px] text-muted-foreground">· {c.at}</span></p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{c.content}</p>
                  {c.replies?.map((r) => (
                    <div key={r.id} className="ml-4 mt-2 flex gap-2 border-l border-border pl-3">
                      <Avatar p={personById(r.authorId)} size="h-5 w-5" />
                      <p className="text-xs leading-relaxed text-muted-foreground"><span className="font-medium text-foreground">{personById(r.authorId).name.split(" ")[0]}</span> {r.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background/40 py-1 pl-4 pr-1">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder="Add a comment…" aria-label="Add a comment" className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground" />
        <button onClick={post} aria-label="Post comment" className="rounded-full bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90"><Send className="h-3 w-3" /></button>
      </div>
    </Stage>
  );
}

const DEMOS: Record<TabId, () => ReactNode> = { views: ViewsDemo, epics: EpicsDemo, teams: TeamsDemo, discuss: DiscussDemo };

export function Capabilities() {
  const [tab, setTab] = useState<TabId>("views");
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
