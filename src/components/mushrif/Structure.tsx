import { AnimatePresence, motion } from "motion/react";
import { Building2, ChevronRight, Flag, Layers, MousePointerClick } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Eyebrow, Reveal } from "./Reveal";
import { Avatar } from "./Console";
import {
  ORG,
  STATUSES,
  STATUS_BAR,
  STATUS_LABEL,
  MILESTONE_TONE,
  countByStatus,
  donePct,
  epicProgress,
  personById,
  type Project,
  type WorkItem,
  type Workspace,
} from "./data";

function StatusBar({ items }: { items: WorkItem[] }) {
  const c = countByStatus(items);
  const total = items.length || 1;
  return (
    <div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
        {STATUSES.map(
          (s) =>
            c[s] > 0 && (
              <span
                key={s}
                className={STATUS_BAR[s]}
                style={{ width: `${(c[s] / total) * 100}%` }}
              />
            ),
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {STATUSES.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${STATUS_BAR[s]}`} /> {STATUS_LABEL[s]}{" "}
            {c[s]}
          </span>
        ))}
      </div>
    </div>
  );
}

function Row({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
    >
      {children}
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}

export function Structure() {
  const [ws, setWs] = useState<Workspace | null>(null);
  const [proj, setProj] = useState<Project | null>(null);
  const level = proj ? "project" : ws ? "workspace" : "org";

  const allItems = ORG.workspaces.flatMap((w) => w.projects).flatMap((p) => p.items);
  const allProjects = ORG.workspaces.flatMap((w) => w.projects);

  return (
    <section
      id="structure"
      className="relative overflow-hidden border-t border-border bg-surface/40 py-24 md:py-36"
    >
      <div className="mx-auto grid max-w-7xl gap-14 px-5 md:px-8 lg:grid-cols-[1fr_1.4fr] lg:items-center">
        <div>
          <Reveal>
            <Eyebrow index="02">Structure</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display mt-6 text-4xl font-medium leading-[1] md:text-6xl">
              A place for everything, and everything in its place.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-muted-foreground">
              Mushrif mirrors how your organization actually works: one organization, a workspace
              per area, projects inside them, and work items broken down as far as you need.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <MousePointerClick className="h-3.5 w-3.5 text-primary" /> Click through the hierarchy
              — it's the real model.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="panel rounded-2xl p-5 sm:p-6">
            {/* breadcrumb */}
            <nav
              aria-label="Hierarchy"
              className="flex flex-wrap items-center gap-1 font-mono text-[11px] text-muted-foreground"
            >
              <button
                onClick={() => {
                  setWs(null);
                  setProj(null);
                }}
                className={`rounded px-1.5 py-0.5 transition-colors hover:text-foreground ${level === "org" ? "text-primary" : ""}`}
              >
                {ORG.name}
              </button>
              {ws && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <button
                    onClick={() => setProj(null)}
                    className={`rounded px-1.5 py-0.5 transition-colors hover:text-foreground ${level === "workspace" ? "text-primary" : ""}`}
                  >
                    {ws.name}
                  </button>
                </>
              )}
              {proj && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="rounded px-1.5 py-0.5 text-primary">{proj.name}</span>
                </>
              )}
            </nav>

            <div className="mt-5">
              <AnimatePresence mode="wait">
                {level === "org" && (
                  <motion.div
                    key="org"
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[11px] text-muted-foreground">
                      <span>{ORG.workspaces.length} workspaces</span>
                      <span>{allProjects.length} projects</span>
                      <span>{allItems.length} work items</span>
                      <span className="text-sage">{donePct(allItems)}% done</span>
                    </div>
                    <div className="space-y-2">
                      {ORG.workspaces.map((w) => (
                        <Row key={w.id} onClick={() => setWs(w)}>
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent">
                            <Building2 className="h-4 w-4 text-primary" />
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium">{w.name}</span>
                            <span className="block truncate font-mono text-[10px] text-muted-foreground">
                              {w.description}
                            </span>
                          </span>
                          <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                            {w.projects.length} projects · {w.teams.length} teams
                          </span>
                        </Row>
                      ))}
                    </div>
                  </motion.div>
                )}

                {level === "workspace" && ws && (
                  <motion.div
                    key={ws.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4 flex flex-wrap gap-2">
                      {ws.teams.map((t) => (
                        <span
                          key={t.id}
                          className="flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs"
                        >
                          {t.name}
                          <span className="flex -space-x-1.5">
                            {t.memberIds.map((id) => (
                              <Avatar key={id} p={personById(id)} size="h-4 w-4" />
                            ))}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {ws.projects.map((p) => (
                        <Row key={p.id} onClick={() => setProj(p)}>
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent font-mono text-[9px] font-semibold text-primary">
                            {p.key}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium">{p.name}</span>
                            <span className="mt-1.5 block h-1 w-full max-w-40 overflow-hidden rounded-full bg-muted">
                              <span
                                className="block h-full bg-sage"
                                style={{ width: `${donePct(p.items)}%` }}
                              />
                            </span>
                          </span>
                          <span className="ml-auto shrink-0 font-mono text-[10px] text-muted-foreground">
                            {p.items.length} items · due {p.due}
                          </span>
                        </Row>
                      ))}
                    </div>
                  </motion.div>
                )}

                {level === "project" && proj && (
                  <motion.div
                    key={proj.id}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 14 }}
                    transition={{ duration: 0.3 }}
                  >
                    <StatusBar items={proj.items} />
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          <Layers className="h-3 w-3 text-primary" /> Epics
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {proj.epics.map((e) => {
                            const p = epicProgress(proj, e.id);
                            return (
                              <li key={e.id} className="rounded-lg border border-border px-3 py-2">
                                <span className="flex justify-between text-xs">
                                  <span className="font-medium">{e.name}</span>
                                  <span className="font-mono text-[10px] text-muted-foreground">
                                    {p.done}/{p.total}
                                  </span>
                                </span>
                                <span className="mt-1.5 block h-1 overflow-hidden rounded-full bg-muted">
                                  <span
                                    className="block h-full bg-primary"
                                    style={{ width: `${p.pct}%` }}
                                  />
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div>
                        <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          <Flag className="h-3 w-3 text-primary" /> Milestones
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {proj.milestones.map((m) => (
                            <li
                              key={m.id}
                              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2"
                            >
                              <span className="flex-1 truncate text-xs font-medium">{m.name}</span>
                              <span className="font-mono text-[10px] text-muted-foreground">
                                {m.due}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 font-mono text-[9px] uppercase ring-1 ${MILESTONE_TONE[m.status]}`}
                              >
                                {m.status.replace("_", " ")}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Work items
                    </p>
                    <ul className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1">
                      {proj.items.map((i) => (
                        <li
                          key={i.id}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs transition-colors hover:bg-accent/40"
                        >
                          <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_BAR[i.status]}`}
                          />
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {i.key}
                          </span>
                          <span className="flex-1 truncate">{i.title}</span>
                          {i.assigneeId && <Avatar p={personById(i.assigneeId)} size="h-5 w-5" />}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
