import { describe, expect, it } from "vitest";
import {
  ORG,
  PEOPLE,
  STATUSES,
  allProjects,
  type Priority,
  type WorkItemType,
} from "@/components/mushrif/data";

const TYPES: WorkItemType[] = ["TASK", "BUG", "STORY"];
const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

// The marketing demos must stay consistent with the real backend models.
describe("Mushrif demo data mirrors the backend models", () => {
  it("every work item key is its project key plus its number", () => {
    for (const p of allProjects)
      for (const i of p.items) expect(i.key).toBe(`${p.key}-${i.number}`);
  });

  it("work item types, statuses and priorities stay within the model enums", () => {
    for (const p of allProjects)
      for (const i of p.items) {
        expect(TYPES).toContain(i.type);
        expect(STATUSES).toContain(i.status);
        expect(PRIORITIES).toContain(i.priority);
      }
  });

  it("every epic, milestone, label and assignee reference resolves", () => {
    const personIds = new Set(PEOPLE.map((p) => p.id));
    for (const p of allProjects) {
      const epicIds = new Set(p.epics.map((e) => e.id));
      const msIds = new Set(p.milestones.map((m) => m.id));
      const labelIds = new Set(p.labels.map((l) => l.id));
      for (const i of p.items) {
        if (i.epicId) expect(epicIds.has(i.epicId)).toBe(true);
        if (i.milestoneId) expect(msIds.has(i.milestoneId)).toBe(true);
        if (i.assigneeId) expect(personIds.has(i.assigneeId)).toBe(true);
        for (const l of i.labelIds) expect(labelIds.has(l)).toBe(true);
      }
    }
  });

  it("every milestone has a due date, as the model requires", () => {
    for (const p of allProjects) for (const m of p.milestones) expect(m.due).toBeTruthy();
  });

  it("project keys are uppercase, as the model enforces", () => {
    for (const p of allProjects) expect(p.key).toMatch(/^[A-Z0-9]+$/);
  });

  it("team members exist and workspaces contain their projects", () => {
    const personIds = new Set(PEOPLE.map((p) => p.id));
    for (const w of ORG.workspaces) {
      expect(w.projects.length).toBeGreaterThan(0);
      for (const t of w.teams) for (const id of t.memberIds) expect(personIds.has(id)).toBe(true);
    }
  });
});
