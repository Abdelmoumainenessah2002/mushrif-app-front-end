// Configurable destination for "Get Started" once the real product is live.
// While empty, the page shows an honest demo/early-access interaction instead.
export const SIGNUP_URL = "";

/* ------------------------------------------------------------------ *
 * Mock domain data for the marketing demos.
 * Shapes and enums mirror the real backend models:
 * Organization → Workspace → Project → WorkItem, plus Epic, Milestone,
 * Team, Label, Comment, Attachment and Activity.
 * ------------------------------------------------------------------ */

export type WorkItemType = "TASK" | "BUG" | "STORY";
export type WorkItemStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type ProjectStatus = "PLANNING" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
export type EpicStatus = "PLANNING" | "ACTIVE" | "COMPLETED" | "ARCHIVED";
export type MilestoneStatus = "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "MISSED" | "ARCHIVED";

export const STATUSES: WorkItemStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

export const STATUS_LABEL: Record<WorkItemStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  DONE: "Done",
};

export const STATUS_TONE: Record<WorkItemStatus, string> = {
  TODO: "text-muted-foreground",
  IN_PROGRESS: "text-sky",
  IN_REVIEW: "text-primary",
  DONE: "text-sage",
};

export const STATUS_BAR: Record<WorkItemStatus, string> = {
  TODO: "bg-muted-foreground/40",
  IN_PROGRESS: "bg-sky",
  IN_REVIEW: "bg-primary",
  DONE: "bg-sage",
};

export const PRIORITY_TONE: Record<Priority, string> = {
  LOW: "bg-muted-foreground/40",
  MEDIUM: "bg-sky",
  HIGH: "bg-primary",
  URGENT: "bg-rose",
};

export const TYPE_TONE: Record<WorkItemType, string> = {
  TASK: "text-sky bg-sky/10 ring-sky/30",
  BUG: "text-rose bg-rose/10 ring-rose/30",
  STORY: "text-sage bg-sage/10 ring-sage/30",
};

export const MILESTONE_TONE: Record<MilestoneStatus, string> = {
  UPCOMING: "text-muted-foreground bg-muted ring-border",
  IN_PROGRESS: "text-sky bg-sky/10 ring-sky/30",
  COMPLETED: "text-sage bg-sage/10 ring-sage/30",
  MISSED: "text-rose bg-rose/10 ring-rose/30",
  ARCHIVED: "text-muted-foreground bg-muted ring-border",
};

export type Person = { id: string; name: string; hue: string };

export const PEOPLE: Person[] = [
  { id: "p1", name: "Layla Haddad", hue: "bg-primary text-primary-foreground" },
  { id: "p2", name: "Omar Benali", hue: "bg-sage text-background" },
  { id: "p3", name: "Sofia Marín", hue: "bg-sky text-background" },
  { id: "p4", name: "Karim Idris", hue: "bg-rose text-background" },
  { id: "p5", name: "Nadia Volkov", hue: "bg-foreground text-background" },
  { id: "p6", name: "Hana Okafor", hue: "bg-accent text-foreground" },
  { id: "p7", name: "Yusuf Amrani", hue: "bg-surface-2 text-foreground" },
  { id: "p8", name: "Elena Rossi", hue: "bg-secondary text-secondary-foreground" },
];

export const personById = (id: string) => PEOPLE.find((p) => p.id === id)!;

export type Label = { id: string; name: string; dot: string };

export type CommentReply = { id: string; authorId: string; content: string; at: string };
export type Comment = CommentReply & { replies?: CommentReply[] };

export type Attachment = { id: string; type: "FILE" | "IMAGE" | "LINK"; name: string };

export type WorkItem = {
  id: string;
  number: number;
  key: string;
  title: string;
  type: WorkItemType;
  status: WorkItemStatus;
  priority: Priority;
  assigneeId: string | null;
  epicId: string | null;
  milestoneId: string | null;
  labelIds: string[];
  due?: string;
  estimate?: number;
  comments?: Comment[];
  attachments?: Attachment[];
  subtasks?: { done: number; total: number };
};

export type Epic = { id: string; name: string; status: EpicStatus; due?: string };
export type Milestone = { id: string; name: string; status: MilestoneStatus; due: string };
export type Team = { id: string; name: string; memberIds: string[] };

export type Project = {
  id: string;
  key: string;
  name: string;
  status: ProjectStatus;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  leadId: string;
  due?: string;
  labels: Label[];
  epics: Epic[];
  milestones: Milestone[];
  items: WorkItem[];
};

export type Workspace = {
  id: string;
  slug: string;
  name: string;
  description: string;
  teams: Team[];
  projects: Project[];
};

export const ORG: { name: string; workspaces: Workspace[] } = {
  name: "Atlas Collective",
  workspaces: [
    {
      id: "w1",
      slug: "product-studio",
      name: "Product Studio",
      description: "Software products, from idea to launch.",
      teams: [
        { id: "t1", name: "Platform", memberIds: ["p1", "p2", "p5"] },
        { id: "t2", name: "Design", memberIds: ["p3", "p6"] },
      ],
      projects: [
        {
          id: "pr1",
          key: "ATLAS",
          name: "Atlas App",
          status: "ACTIVE",
          priority: "HIGH",
          leadId: "p1",
          due: "Jun 30",
          labels: [
            { id: "l1", name: "design", dot: "bg-sky" },
            { id: "l2", name: "backend", dot: "bg-sage" },
            { id: "l3", name: "urgent", dot: "bg-rose" },
            { id: "l4", name: "research", dot: "bg-primary" },
          ],
          epics: [
            { id: "e1", name: "Onboarding revamp", status: "ACTIVE", due: "May 2" },
            { id: "e2", name: "Offline sync", status: "PLANNING", due: "Jun 20" },
          ],
          milestones: [
            { id: "m1", name: "Beta v0.9", status: "COMPLETED", due: "Mar 14" },
            { id: "m2", name: "Public launch", status: "IN_PROGRESS", due: "Jun 30" },
          ],
          items: [
            {
              id: "i1",
              number: 1,
              key: "ATLAS-1",
              title: "Sketch the new onboarding flow",
              type: "STORY",
              status: "DONE",
              priority: "MEDIUM",
              assigneeId: "p3",
              epicId: "e1",
              milestoneId: "m1",
              labelIds: ["l1"],
              estimate: 3,
            },
            {
              id: "i2",
              number: 2,
              key: "ATLAS-2",
              title: "Wire up email verification",
              type: "TASK",
              status: "DONE",
              priority: "HIGH",
              assigneeId: "p2",
              epicId: "e1",
              milestoneId: "m1",
              labelIds: ["l2"],
            },
            {
              id: "i3",
              number: 3,
              key: "ATLAS-3",
              title: "Empty states for the projects list",
              type: "TASK",
              status: "IN_REVIEW",
              priority: "LOW",
              assigneeId: "p3",
              epicId: "e1",
              milestoneId: null,
              labelIds: ["l1"],
            },
            {
              id: "i4",
              number: 4,
              key: "ATLAS-4",
              title: "Sync engine conflict resolution",
              type: "TASK",
              status: "IN_PROGRESS",
              priority: "HIGH",
              assigneeId: "p2",
              epicId: "e2",
              milestoneId: "m2",
              labelIds: ["l2"],
              estimate: 8,
              subtasks: { done: 2, total: 5 },
              comments: [
                {
                  id: "c1",
                  authorId: "p2",
                  content:
                    "Merging offline edits is the risky part — we need one clear rule per field.",
                  at: "2h ago",
                  replies: [
                    {
                      id: "c1r",
                      authorId: "p1",
                      content: "Agreed. Last-write-wins for fields, manual review for deletes?",
                      at: "1h ago",
                    },
                  ],
                },
                {
                  id: "c2",
                  authorId: "p3",
                  content: "Drafted the sync states for the UI — flow attached.",
                  at: "45m ago",
                },
              ],
              attachments: [
                { id: "a1", type: "FILE", name: "sync-spec.pdf" },
                { id: "a2", type: "IMAGE", name: "offline-flow.png" },
                { id: "a3", type: "LINK", name: "Figma — sync states" },
              ],
            },
            {
              id: "i5",
              number: 5,
              key: "ATLAS-5",
              title: "Crash on logout (Android)",
              type: "BUG",
              status: "IN_PROGRESS",
              priority: "URGENT",
              assigneeId: "p5",
              epicId: "e2",
              milestoneId: null,
              labelIds: ["l3", "l2"],
            },
            {
              id: "i6",
              number: 6,
              key: "ATLAS-6",
              title: "Interview five beta users",
              type: "STORY",
              status: "TODO",
              priority: "MEDIUM",
              assigneeId: "p6",
              epicId: "e1",
              milestoneId: null,
              labelIds: ["l4"],
            },
            {
              id: "i7",
              number: 7,
              key: "ATLAS-7",
              title: "Rate limiting on the API",
              type: "TASK",
              status: "TODO",
              priority: "HIGH",
              assigneeId: "p2",
              epicId: "e2",
              milestoneId: "m2",
              labelIds: ["l2"],
            },
            {
              id: "i8",
              number: 8,
              key: "ATLAS-8",
              title: "Onboarding copy in Arabic",
              type: "TASK",
              status: "TODO",
              priority: "MEDIUM",
              assigneeId: "p6",
              epicId: "e1",
              milestoneId: "m2",
              labelIds: ["l1"],
            },
            {
              id: "i9",
              number: 9,
              key: "ATLAS-9",
              title: "Launch checklist",
              type: "TASK",
              status: "TODO",
              priority: "HIGH",
              assigneeId: "p1",
              epicId: null,
              milestoneId: "m2",
              labelIds: [],
            },
            {
              id: "i10",
              number: 10,
              key: "ATLAS-10",
              title: "Dark mode contrast audit",
              type: "BUG",
              status: "IN_REVIEW",
              priority: "MEDIUM",
              assigneeId: "p3",
              epicId: null,
              milestoneId: null,
              labelIds: ["l1"],
            },
            {
              id: "i11",
              number: 11,
              key: "ATLAS-11",
              title: "Beta feedback triage",
              type: "STORY",
              status: "DONE",
              priority: "MEDIUM",
              assigneeId: "p1",
              epicId: null,
              milestoneId: "m1",
              labelIds: ["l4"],
            },
            {
              id: "i12",
              number: 12,
              key: "ATLAS-12",
              title: "Push notification opt-in",
              type: "STORY",
              status: "IN_PROGRESS",
              priority: "MEDIUM",
              assigneeId: "p5",
              epicId: "e2",
              milestoneId: "m2",
              labelIds: ["l2"],
            },
          ],
        },
        {
          id: "pr2",
          key: "NOMAD",
          name: "Nomad Dashboard",
          status: "PLANNING",
          priority: "MEDIUM",
          leadId: "p2",
          due: "Aug 1",
          labels: [
            { id: "l5", name: "data", dot: "bg-primary" },
            { id: "l6", name: "infra", dot: "bg-sage" },
          ],
          epics: [{ id: "e3", name: "Reporting core", status: "PLANNING", due: "Jul 15" }],
          milestones: [{ id: "m3", name: "Internal alpha", status: "UPCOMING", due: "Aug 1" }],
          items: [
            {
              id: "i13",
              number: 1,
              key: "NOMAD-1",
              title: "Metrics schema draft",
              type: "TASK",
              status: "IN_PROGRESS",
              priority: "HIGH",
              assigneeId: "p2",
              epicId: "e3",
              milestoneId: "m3",
              labelIds: ["l5"],
            },
            {
              id: "i14",
              number: 2,
              key: "NOMAD-2",
              title: "Chart library evaluation",
              type: "TASK",
              status: "TODO",
              priority: "LOW",
              assigneeId: "p5",
              epicId: null,
              milestoneId: null,
              labelIds: ["l5"],
            },
            {
              id: "i15",
              number: 3,
              key: "NOMAD-3",
              title: "CSV export",
              type: "STORY",
              status: "TODO",
              priority: "MEDIUM",
              assigneeId: "p7",
              epicId: "e3",
              milestoneId: "m3",
              labelIds: ["l5"],
            },
            {
              id: "i16",
              number: 4,
              key: "NOMAD-4",
              title: "Workspace switcher flicker",
              type: "BUG",
              status: "TODO",
              priority: "MEDIUM",
              assigneeId: null,
              epicId: null,
              milestoneId: null,
              labelIds: [],
            },
            {
              id: "i17",
              number: 5,
              key: "NOMAD-5",
              title: "Seed the demo dataset",
              type: "TASK",
              status: "DONE",
              priority: "MEDIUM",
              assigneeId: "p7",
              epicId: null,
              milestoneId: "m3",
              labelIds: ["l6"],
            },
            {
              id: "i18",
              number: 6,
              key: "NOMAD-6",
              title: "Dashboard layout grid",
              type: "STORY",
              status: "IN_REVIEW",
              priority: "MEDIUM",
              assigneeId: "p3",
              epicId: "e3",
              milestoneId: null,
              labelIds: [],
            },
          ],
        },
      ],
    },
    {
      id: "w2",
      slug: "field-ops",
      name: "Field Operations",
      description: "Rollouts, partners and on-the-ground work.",
      teams: [{ id: "t3", name: "Logistics", memberIds: ["p4", "p7", "p8"] }],
      projects: [
        {
          id: "pr3",
          key: "CARAVAN",
          name: "Caravan Rollout",
          status: "ACTIVE",
          priority: "CRITICAL",
          leadId: "p4",
          due: "Sep 1",
          labels: [
            { id: "l7", name: "ops", dot: "bg-primary" },
            { id: "l8", name: "partner", dot: "bg-sky" },
            { id: "l9", name: "blocker", dot: "bg-rose" },
          ],
          epics: [{ id: "e4", name: "Pilot cities", status: "ACTIVE", due: "Sep 1" }],
          milestones: [
            { id: "m4", name: "Pilot — Oran", status: "IN_PROGRESS", due: "May 20" },
            { id: "m5", name: "Pilot — Constantine", status: "UPCOMING", due: "Sep 1" },
          ],
          items: [
            {
              id: "i19",
              number: 1,
              key: "CARAVAN-1",
              title: "Sign pilot partner agreement",
              type: "TASK",
              status: "DONE",
              priority: "HIGH",
              assigneeId: "p4",
              epicId: "e4",
              milestoneId: "m4",
              labelIds: ["l8"],
            },
            {
              id: "i20",
              number: 2,
              key: "CARAVAN-2",
              title: "Recruit twelve couriers",
              type: "STORY",
              status: "IN_PROGRESS",
              priority: "HIGH",
              assigneeId: "p7",
              epicId: "e4",
              milestoneId: "m4",
              labelIds: ["l7"],
            },
            {
              id: "i21",
              number: 3,
              key: "CARAVAN-3",
              title: "Route planning workshop",
              type: "TASK",
              status: "IN_REVIEW",
              priority: "MEDIUM",
              assigneeId: "p8",
              epicId: null,
              milestoneId: "m4",
              labelIds: ["l7"],
            },
            {
              id: "i22",
              number: 4,
              key: "CARAVAN-4",
              title: "Payment reconciliation bug",
              type: "BUG",
              status: "IN_PROGRESS",
              priority: "URGENT",
              assigneeId: "p4",
              epicId: null,
              milestoneId: null,
              labelIds: ["l9"],
            },
            {
              id: "i23",
              number: 5,
              key: "CARAVAN-5",
              title: "Courier onboarding kit",
              type: "TASK",
              status: "TODO",
              priority: "MEDIUM",
              assigneeId: "p8",
              epicId: "e4",
              milestoneId: "m5",
              labelIds: ["l7"],
            },
            {
              id: "i24",
              number: 6,
              key: "CARAVAN-6",
              title: "City permit paperwork",
              type: "TASK",
              status: "TODO",
              priority: "LOW",
              assigneeId: "p4",
              epicId: null,
              milestoneId: "m5",
              labelIds: ["l8"],
            },
            {
              id: "i25",
              number: 7,
              key: "CARAVAN-7",
              title: "Pilot retrospective notes",
              type: "STORY",
              status: "TODO",
              priority: "LOW",
              assigneeId: "p7",
              epicId: null,
              milestoneId: "m4",
              labelIds: [],
            },
            {
              id: "i26",
              number: 8,
              key: "CARAVAN-8",
              title: "SMS notifications in Arabic",
              type: "STORY",
              status: "TODO",
              priority: "MEDIUM",
              assigneeId: null,
              epicId: "e4",
              milestoneId: "m5",
              labelIds: ["l7"],
            },
          ],
        },
      ],
    },
  ],
};

export const allProjects = ORG.workspaces.flatMap((w) => w.projects);

export const countByStatus = (items: WorkItem[]): Record<WorkItemStatus, number> => {
  const c: Record<WorkItemStatus, number> = { TODO: 0, IN_PROGRESS: 0, IN_REVIEW: 0, DONE: 0 };
  for (const i of items) c[i.status]++;
  return c;
};

export const donePct = (items: WorkItem[]) =>
  items.length === 0
    ? 0
    : Math.round((items.filter((i) => i.status === "DONE").length / items.length) * 100);

export const epicProgress = (project: Project, epicId: string) => {
  const items = project.items.filter((i) => i.epicId === epicId);
  return {
    total: items.length,
    done: items.filter((i) => i.status === "DONE").length,
    pct: donePct(items),
  };
};

export const initials = (n: string) =>
  n
    .split(" ")
    .map((p) => p[0])
    .join("");

export const scrollTo = (id: string) =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
