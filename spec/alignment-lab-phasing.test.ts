import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The Alignment Lab spans Weeks 9-11: role assignment, the pre-meeting
// contact window and each group's self-arranged decision meeting all happen
// within Week 9 itself; Week 10's session is a reveal and consequence test
// against the record a group already produced, not the decision meeting;
// Week 11 is the ethics discussion, and the graded submission is due before
// that session runs. This file guards against the schedule contradiction
// found in an earlier draft, where Week 9 implied waiting for "the formal
// decision meeting in Week 10".

const week09 = readFileSync(resolve("src/content/sessions/09-who-actually-decides.md"), "utf8");
const week10 = readFileSync(resolve("src/content/sessions/10-minutes-make-memory.md"), "utf8");
const week11 = readFileSync(resolve("src/content/sessions/11-the-ethics-of-alignment.md"), "utf8");
const alignmentLabAssessment = readFileSync(
  resolve("src/content/assessments/alignment-lab.md"),
  "utf8",
);

function extractFrontmatterDate(text: string): string {
  const match = text.match(/^date:\s*(\d{4}-\d{2}-\d{2})/m);
  if (!match) throw new Error("no date found in frontmatter");
  return match[1];
}

function extractFrontmatterDue(text: string): string {
  const match = text.match(/^due:\s*(\d{4}-\d{2}-\d{2})/m);
  if (!match) throw new Error("no due date found in frontmatter");
  return match[1];
}

describe("Alignment Lab phase ordering: Week 9 does not defer the decision meeting to Week 10", () => {
  it("Week 9 states the contact window and decision meeting happen within Week 9 itself", () => {
    expect(week09).toMatch(/does not wait for\s+(the\s+)?next scheduled class/i);
    expect(week09).toMatch(/arranges and holds\s+its own decision meeting/i);
  });

  it("Week 9 does not describe a 'formal decision meeting' placed inside Week 10", () => {
    expect(week09).not.toMatch(/formal decision meeting in Week 10/i);
  });

  it("[negative example] the old contradictory phrasing would be caught", () => {
    const old =
      "You have until the formal decision meeting in Week 10 to write your strategy memo.";
    expect(old).toMatch(/formal decision meeting in Week 10/i);
  });
});

describe("Alignment Lab phase ordering: Week 10 is a reveal, not the decision meeting itself", () => {
  it("Week 10 assumes a decision record already exists going in", () => {
    expect(week10).toMatch(/not\s+yet\s+produced\s+a\s+decision\s+record|assumes\s+one\s+exists/i);
  });

  it("Week 10 names the reveal and consequence test, not a first-time negotiation", () => {
    expect(week10).toMatch(/reveal and consequence test/i);
  });
});

describe("Alignment Lab phase ordering: the Week 11 submission is due before that session runs", () => {
  it("the assessment's due date falls on Week 11's own session date", () => {
    const week11Date = extractFrontmatterDate(week11);
    const dueDate = extractFrontmatterDue(alignmentLabAssessment);
    expect(dueDate).toBe(week11Date);
  });

  it("Week 11 states the submission is due before the session, not after it", () => {
    expect(week11).toMatch(/due\s+today\s+at\s+noon,\s+before\s+this\s+session\s+runs/i);
  });

  it("[negative example] a due date after Week 11's session date would be caught", () => {
    const week11Date = extractFrontmatterDate(week11);
    const wrongDue = "2027-05-10"; // Week 12's date, not Week 11's
    expect(wrongDue).not.toBe(week11Date);
  });
});
