import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  Columns3,
  Flag,
  List,
  MessageSquare,
  Paperclip,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  ORG,
  STATUSES,
  STATUS_BAR,
  STATUS_LABEL,
  STATUS_TONE,
  PRIORITY_TONE,
  TYPE_TONE,
  donePct,
  initials,
  personById,
  type Person,
  type WorkItem,
  type WorkItemStatus,
} from "./data";

export function Avatar({
  p,
  size = "h-8 w-8",
}: {
  p: Pick<Person, "name" | "hue">;
  size?: string;
}) {
  return (
    <span
      className={`${size} ${p.hue} grid shrink-0 place-items-center rounded-full font-mono text-[11px] font-semibold ring-2 ring-surface`}
    >
      {initials(p.name)}
    </span>
  );
}

export function TypeChip({ t }: { t: WorkItem["type"] }) {
  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ring-1 ${TYPE_TONE[t]}`}
    >
      {t}
    </span>
  );
}

const NEXT: Record<WorkItemStatus, WorkItemStatus> = {
  TODO: "IN_PROGRESS",
  IN_PROGRESS: "IN_REVIEW",
  IN_REVIEW: "DONE",
  DONE: "DONE",
};

type FeedEvent = { icon: typeof CheckCircle2; text: string; tone: string; key: number };

const EVENTS = [
  { icon: CheckCircle2, text: "Sofia moved ATLAS-3 to In review", tone: "text-primary" },
  { icon: UserPlus, text: "Omar assigned CARAVAN-4 to Karim", tone: "text-sky" },
  { icon: MessageSquare, text: "Hana commented on ATLAS-4", tone: "text-sage" },
  { icon: Flag, text: "Milestone Beta v0.9 completed", tone: "text-primary" },
  { icon: Paperclip, text: "Sofia attached offline-flow.png", tone: "text-rose" },
];

export function Console() {
  const [wsId, setWsId] = useState(ORG.workspaces[0]!.id);
  const ws = ORG.workspaces.find((w) => w.id === wsId)!;
  const [projId, setProjId] = useState(ws.projects[0]!.id);
  const project = ws.projects.find((p) => p.id === projId)!;
  const [boards, setBoards] = useState<Record<string, WorkItem[]>>(() =>
    Object.fromEntries(ORG.workspaces.flatMap((w) => w.projects).map((p) => [p.id, p.items])),
  );
  const items = boards[project.id]!;
  const [view, setView] = useState<"board" | "list">("board");
  const [feed, setFeed] = useState<FeedEvent[]>(() =>
    EVENTS.slice(0, 3).map((e, i) => ({ ...e, key: i })),
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 3;
    const t = setInterval(() => {
      const e = EVENTS[n % EVENTS.length]!;
      setFeed((f) => [{ ...e, key: n }, ...f].slice(0, 3));
      n++;
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const selectWs = (id: string) => {
    setWsId(id);
    setProjId(ORG.workspaces.find((w) => w.id === id)!.projects[0]!.id);
  };

  const advance = (item: WorkItem) => {
    const next = NEXT[item.status];
    if (next === item.status) return;
    setBoards((b) => ({
      ...b,
      [project.id]: b[project.id]!.map((x) => (x.id === item.id ? { ...x, status: next } : x)),
    }));
    setFeed((f) =>
      [
        {
          icon: CheckCircle2,
          text: `You moved ${item.key} to ${STATUS_LABEL[next]}`,
          tone: "text-primary",
          key: Date.now(),
        },
        ...f,
      ].slice(0, 3),
    );
  };

  const pct = donePct(items);

  return (
    <div className="panel relative overflow-hidden rounded-2xl text-left">
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <div className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full bg-accent" />
          <i className="h-2.5 w-2.5 rounded-full bg-accent" />
          <i className="h-2.5 w-2.5 rounded-full bg-accent" />
        </div>
        <div className="mx-auto font-mono text-[11px] text-muted-foreground">
          mushrif / {ws.slug} / {project.key.toLowerCase()}
        </div>
      </div>

      {/* workspace + project + view toolbar */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-4 py-2.5">
        {ORG.workspaces.map((w) => (
          <button
            key={w.id}
            onClick={() => selectWs(w.id)}
            aria-pressed={w.id === wsId}
            className={`rounded-full px-3 py-1 font-mono text-[11px] transition-colors ${w.id === wsId ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {w.slug}
          </button>
        ))}
        <span className="mx-1 hidden h-4 w-px bg-border sm:block" />
        {ws.projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setProjId(p.id)}
            aria-pressed={p.id === projId}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-colors ${p.id === projId ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <span className="font-mono text-[10px]">{p.key}</span> {p.name}
          </button>
        ))}
        <div className="ml-auto flex rounded-full border border-border p-0.5">
          <button
            onClick={() => setView("board")}
            aria-label="Board view"
            aria-pressed={view === "board"}
            className={`rounded-full p-1.5 transition-colors ${view === "board" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
          >
            <Columns3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setView("list")}
            aria-label="List view"
            aria-pressed={view === "list"}
            className={`rounded-full p-1.5 transition-colors ${view === "list" ? "bg-accent text-foreground" : "text-muted-foreground"}`}
          >
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_15rem]">
        <div>
          {/* project summary */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent font-mono text-[10px] font-semibold text-primary">
              {project.key}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{project.name}</p>
              <p className="font-mono text-[10px] text-muted-foreground">
                lead {personById(project.leadId).name} · due {project.due}
              </p>
            </div>
            <div className="flex w-28 shrink-0 flex-col gap-1">
              <span className="text-right font-mono text-[10px] text-muted-foreground">
                {pct}% done
              </span>
              <span className="h-1 overflow-hidden rounded-full bg-muted">
                <motion.span
                  className="block h-full bg-sage"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${project.id}-${view}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {view === "board" ? (
                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                  {STATUSES.map((s) => {
                    const col = items.filter((i) => i.status === s);
                    return (
                      <div
                        key={s}
                        className="rounded-xl border border-border/60 bg-background/30 p-2"
                      >
                        <p className="flex items-center gap-2 px-1.5 pb-2 font-mono text-[10px] uppercase tracking-widest">
                          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_BAR[s]}`} />
                          <span className={STATUS_TONE[s]}>{STATUS_LABEL[s]}</span>
                          <span className="ml-auto text-muted-foreground">{col.length}</span>
                        </p>
                        <div className="space-y-2">
                          {col.map((item) => (
                            <motion.button
                              layoutId={item.id}
                              key={item.id}
                              onClick={() => advance(item)}
                              title={item.status === "DONE" ? "Done" : "Click to move forward"}
                              className="block w-full rounded-lg border border-border bg-surface p-2.5 text-left transition-colors hover:border-primary/40"
                            >
                              <span className="flex items-center gap-2">
                                <span className="font-mono text-[10px] text-muted-foreground">
                                  {item.key}
                                </span>
                                <span
                                  className={`ml-auto h-1 w-6 rounded-full ${PRIORITY_TONE[item.priority]}`}
                                />
                              </span>
                              <span className="mt-1.5 block text-xs font-medium leading-snug">
                                {item.title}
                              </span>
                              <span className="mt-2 flex items-center gap-1.5">
                                <TypeChip t={item.type} />
                                {item.labelIds.slice(0, 2).map((l) => {
                                  const label = project.labels.find((x) => x.id === l)!;
                                  return (
                                    <span
                                      key={l}
                                      title={label.name}
                                      className={`h-1.5 w-1.5 rounded-full ${label.dot}`}
                                    />
                                  );
                                })}
                                {item.assigneeId && (
                                  <span className="ml-auto">
                                    <Avatar p={personById(item.assigneeId)} size="h-5 w-5" />
                                  </span>
                                )}
                              </span>
                            </motion.button>
                          ))}
                          {col.length === 0 && (
                            <p className="rounded-lg border border-dashed border-border px-2 py-4 text-center font-mono text-[10px] text-muted-foreground">
                              empty
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="divide-y divide-border p-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => advance(item)}
                      title={item.status === "DONE" ? "Done" : "Click to move forward"}
                      className="grid w-full grid-cols-[4.5rem_1fr_auto] items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent/50 sm:grid-cols-[5.5rem_1fr_5rem_5.5rem_2rem]"
                    >
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.key}
                      </span>
                      <span className="truncate text-sm">{item.title}</span>
                      <span className="hidden sm:block">
                        <TypeChip t={item.type} />
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider ${STATUS_TONE[item.status]}`}
                      >
                        {STATUS_LABEL[item.status]}
                      </span>
                      <span className="hidden justify-self-end sm:block">
                        {item.assigneeId && (
                          <Avatar p={personById(item.assigneeId)} size="h-6 w-6" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="border-t border-border bg-background/30 p-4 lg:border-l lg:border-t-0">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-sage" /> Activity
          </p>
          <ul className="mt-3 space-y-2">
            <AnimatePresence initial={false}>
              {feed.map((e) => (
                <motion.li
                  key={e.key}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="flex gap-2.5 rounded-lg border border-border bg-surface p-2.5"
                >
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
