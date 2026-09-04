import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

interface ApiNode {
  id: string;
  type: string;
  related?: string[];
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

const byWeek = (type: string) => {
  const nodes = api.nodes.filter((node) => node.type === type);
  const map = new Map<number, ApiNode>();
  const duplicateWeeks: number[] = [];
  for (const node of nodes) {
    const week = Number(node.meta?.week);
    if (map.has(week)) duplicateWeeks.push(week);
    map.set(week, node);
  }
  return { map, duplicateWeeks };
};

const sessions = byWeek("sessions");
const lectures = byWeek("lectures");
const sessionsByWeek = sessions.map;
const lecturesByWeek = lectures.map;

const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1);

// Odd weeks are taught by marisol-quaye, even weeks by idris-fenn — see the
// two people bios, which describe this same alternation in prose.
const expectedTeacher = (week: number) => (week % 2 === 1 ? "marisol-quaye" : "idris-fenn");

describe("Twelve-week coverage: exactly one session and one lecture per week", () => {
  it("has a session for every week 1-12, no duplicates or gaps", () => {
    expect([...sessionsByWeek.keys()].sort((a, b) => a - b)).toEqual(WEEKS);
  });

  it("has a lecture for every week 1-12, no duplicates or gaps", () => {
    expect([...lecturesByWeek.keys()].sort((a, b) => a - b)).toEqual(WEEKS);
  });

  it("[negative example] a lecture list missing a week would fail this check", () => {
    const brokenWeeks = WEEKS.filter((w) => w !== 7);
    expect(brokenWeeks).not.toEqual(WEEKS);
  });

  // A Map keyed by week silently keeps only the last of two sessions/lectures
  // sharing a week number, so the count-of-keys checks above would still pass
  // with one week duplicated and another genuinely missing. Check the raw
  // list directly instead of trusting the deduped map.
  it("no two sessions declare the same week", () => {
    expect(sessions.duplicateWeeks, `duplicate week numbers: ${sessions.duplicateWeeks.join(", ")}`).toEqual([]);
  });

  it("no two lectures declare the same week", () => {
    expect(lectures.duplicateWeeks, `duplicate week numbers: ${lectures.duplicateWeeks.join(", ")}`).toEqual([]);
  });

  it("[negative example] two nodes sharing a week number would be flagged", () => {
    const duplicateWeeks: number[] = [];
    const seen = new Set<number>();
    for (const week of [1, 2, 2, 3]) {
      if (seen.has(week)) duplicateWeeks.push(week);
      seen.add(week);
    }
    expect(duplicateWeeks).not.toEqual([]);
  });
});

describe("Twelve-week coverage: no page is left as a hidden outline stub", () => {
  it("no session carries a leftover `outline` marker", () => {
    for (const week of WEEKS) {
      const node = sessionsByWeek.get(week);
      expect(node?.meta?.outline, `sessions week ${week} still has an outline marker`).toBeFalsy();
    }
  });

  it("no lecture carries a leftover `outline` marker", () => {
    for (const week of WEEKS) {
      const node = lecturesByWeek.get(week);
      expect(node?.meta?.outline, `lectures week ${week} still has an outline marker`).toBeFalsy();
    }
  });
});

describe("Twelve-week coverage: every week's session and lecture link to each other", () => {
  it("each session's related list is non-empty and points at its paired lecture", () => {
    for (const week of WEEKS) {
      const node = sessionsByWeek.get(week);
      const weekStr = String(week).padStart(2, "0");
      expect(node?.related?.length, `sessions week ${week} has no related links`).toBeGreaterThan(0);
      expect(
        node?.related,
        `sessions week ${week} does not link to lectures/week-${weekStr}`,
      ).toContain(`lectures/week-${weekStr}`);
    }
  });

  it("each lecture's related list is non-empty and points at its own week's session", () => {
    for (const week of WEEKS) {
      const node = lecturesByWeek.get(week);
      const sessionId = sessionsByWeek.get(week)?.id;
      expect(node?.related?.length, `lectures week ${week} has no related links`).toBeGreaterThan(0);
      // A prefix check like `id.startsWith("sessions/")` would pass even if the
      // lecture links to a different week's session, so require the exact id.
      expect(
        node?.related,
        `lectures week ${week} does not link back to its own session (${sessionId})`,
      ).toContain(sessionId);
    }
  });

  it("[negative example] an empty related list is caught", () => {
    const broken: string[] = [];
    expect(broken.length).not.toBeGreaterThan(0);
  });

  it("[negative example] a lecture linking to the wrong week's session is caught", () => {
    const related = ["sessions/03-the-agenda-is-an-argument"];
    const expectedSessionId = "sessions/04-the-meeting-before-the-meeting";
    expect(related).not.toContain(expectedSessionId);
  });
});

describe("Twelve-week coverage: teaching alternates consistently between the two staff", () => {
  it("sessions alternate marisol-quaye (odd weeks) and idris-fenn (even weeks)", () => {
    for (const week of WEEKS) {
      const node = sessionsByWeek.get(week);
      const teachers = node?.meta?.teachers as string[] | undefined;
      expect(teachers, `sessions week ${week} has no teachers`).toContain(expectedTeacher(week));
    }
  });

  it("lectures alternate the same way as their paired sessions", () => {
    for (const week of WEEKS) {
      const node = lecturesByWeek.get(week);
      const teachers = node?.meta?.teachers as string[] | undefined;
      expect(teachers, `lectures week ${week} has no teachers`).toContain(expectedTeacher(week));
    }
  });

  it("[negative example] a week taught by the wrong person is caught", () => {
    const teachers = ["marisol-quaye"];
    expect(teachers).not.toContain(expectedTeacher(2));
  });
});

describe("Twelve-week coverage: dates run one Monday per week, in order", () => {
  const weeklyDates = (map: Map<number, ApiNode>) =>
    WEEKS.map((week) => String(map.get(week)?.meta?.date).slice(0, 10));

  it("session dates advance by exactly 7 days each week", () => {
    const dates = weeklyDates(sessionsByWeek).map((d) => new Date(d).getTime());
    for (let i = 1; i < dates.length; i++) {
      const diffDays = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24);
      expect(diffDays, `week ${i + 1} is not 7 days after week ${i}`).toBe(7);
    }
  });

  it("lecture dates match their paired session's date exactly", () => {
    for (const week of WEEKS) {
      const sessionDate = String(sessionsByWeek.get(week)?.meta?.date).slice(0, 10);
      const lectureDate = String(lecturesByWeek.get(week)?.meta?.date).slice(0, 10);
      expect(lectureDate, `week ${week} lecture/session dates disagree`).toBe(sessionDate);
    }
  });

  it("[negative example] a week out of sequence is caught", () => {
    const dates = ["2027-02-22", "2027-03-08", "2027-03-01"].map((d) => new Date(d).getTime());
    const diff = (dates[2] - dates[1]) / (1000 * 60 * 60 * 24);
    expect(diff).not.toBe(7);
  });
});

describe("Student-facing hub pages carry no developer-facing notes", () => {
  const hubPages = [
    "src/pages/assessments/index.mdx",
    "src/pages/lectures/index.mdx",
    "src/pages/sessions/index.astro",
    "src/pages/policies/index.mdx",
  ];

  const DEV_MARKERS = [/STARTER_CONTENT/, /\bTODO\b/, /\bplaceholder\b/i, /\boutline:\s*true\b/];

  it("contains none of the known developer-facing markers", () => {
    for (const path of hubPages) {
      const text = readFileSync(resolve(path), "utf8");
      for (const marker of DEV_MARKERS) {
        expect(marker.test(text), `${path} matches developer marker ${marker}`).toBe(false);
      }
    }
  });

  it("[negative example] a page with a leftover STARTER_CONTENT marker is caught", () => {
    const fake = "<!-- STARTER_CONTENT: replace this section -->";
    expect(DEV_MARKERS.some((marker) => marker.test(fake))).toBe(true);
  });
});
