import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { engagementSignalInviteList } from "../src/data/case-facts";

const week2Lecture = readFileSync(resolve("src/content/lectures/week-02.md"), "utf8");
const week2Session = readFileSync(resolve("src/content/sessions/02-first-review.md"), "utf8");
const week8 = readFileSync(resolve("src/content/sessions/08-dissent-without-disappearing.md"), "utf8");
const week9 = readFileSync(resolve("src/content/sessions/09-who-actually-decides.md"), "utf8");

describe("Week 2's invite list keeps decisionRight independent of participationStatus", () => {
  // The taxonomy's whole point (src/data/case-facts.ts comment above
  // engagementSignalInviteList) is that participationStatus, decisionRight
  // and informationTiming are three independent axes, not one classification
  // wearing three names. A regression that quietly collapsed decisionRight
  // into a function of participationStatus (e.g. "everyone who attended
  // gets a vote") would still pass a field-non-empty check but would have
  // lost the taxonomy's actual claim.
  it("more than one decisionRight value appears among attendees who share the same participationStatus", () => {
    const attended = engagementSignalInviteList.filter(
      (entry) => entry.participationStatus === "invited-and-attended",
    );
    const decisionRights = new Set(attended.map((entry) => entry.decisionRight));
    expect(attended.length).toBeGreaterThan(1);
    expect(decisionRights.size).toBeGreaterThan(1);
  });

  it("Wren Castellano attends and is informed during the decision while holding no vote or advisory right", () => {
    const wren = engagementSignalInviteList.find((entry) => entry.name === "Wren Castellano");
    expect(wren).toBeDefined();
    expect(wren?.participationStatus).toBe("invited-and-attended");
    expect(wren?.decisionRight).toBe("observe");
    expect(wren?.informationTiming).toBe("during");
  });

  it("[negative example] a list where every attendee shares one decisionRight would fail the independence check", () => {
    const collapsed = engagementSignalInviteList.map((entry) => ({
      ...entry,
      decisionRight: entry.participationStatus === "invited-and-attended" ? "vote" : "none",
    })) as typeof engagementSignalInviteList;
    const attended = collapsed.filter(
      (entry) => entry.participationStatus === "invited-and-attended",
    );
    const decisionRights = new Set(attended.map((entry) => entry.decisionRight));
    expect(decisionRights.size).toBe(1);
  });

  // The canonical data has always said `observe`, but a past drift left the
  // Week 2 lecture and session pages describing the same seat as "no
  // decision right at all" — a plain reading of "none", not "observe". A
  // check against case-facts.ts alone can't catch that: it only proves the
  // data is self-consistent, not that the pages agree with it. These tests
  // read the lecture and session source directly, alongside the data.
  it("Week 2 lecture describes Castellano's decision right as Observe, not None, matching the canonical data", () => {
    const wren = engagementSignalInviteList.find((entry) => entry.name === "Wren Castellano");
    expect(wren?.decisionRight).toBe("observe");
    expect(week2Lecture).toMatch(/Castellano.*\*\*observe\*\*/i);
    expect(week2Lecture).not.toMatch(/Castellano — attends, no decision right/i);
  });

  it("Week 2 lecture explains observe as present but unable to decide, approve, vote, or advise", () => {
    expect(week2Lecture).toMatch(
      /can be present to observe, but cannot decide, approve, vote, or advise/i,
    );
  });

  it("Week 2 session table and prose also say Observe for Castellano, not None", () => {
    expect(week2Session).toMatch(/Wren Castellano.*\*\*Observe\*\*/i);
    expect(week2Session).not.toMatch(/Wren Castellano.*\*\*None\*\*/i);
    expect(week2Session).toMatch(/holds\s+\*\*observe\*\*/i);
  });

  it("Week 2 session lists observe as one of the decision-right values a seat on this list can hold", () => {
    expect(week2Session).toMatch(/vote, advise, observe, or none/i);
  });

  it("[negative example] the old wording ('attends, no decision right') would fail the lecture check above", () => {
    const oldWording =
      "Castellano — attends, no decision right, informed *during* (present in the room, not told afterward)";
    expect(oldWording).not.toMatch(/Castellano.*\*\*observe\*\*/i);
    expect(oldWording).toMatch(/Castellano — attends, no decision right/i);
  });

  it("[negative example] the old session wording ('holds no decision right at all') would fail the session check above", () => {
    const oldSessionWording =
      "Wren Castellano | Internal Communications Lead | Invited, attended | **None** | **During** | Drafts the announcement once decided";
    expect(oldSessionWording).not.toMatch(/Wren Castellano.*\*\*Observe\*\*/i);
    expect(oldSessionWording).toMatch(/Wren Castellano.*\*\*None\*\*/i);
  });
});

describe("not-informed is a valid information timing but never a decision right", () => {
  // InformationTiming was extended to include "not-informed" so the
  // taxonomy can express a seat that never learns the outcome through any
  // documented channel — distinct from "after", which still means the
  // outcome eventually arrives. DecisionRight has no equivalent value:
  // absence of a decision right is expressed by "none", never by
  // "not-informed", which describes timing, not standing.
  it("no invite-list entry uses not-informed as a decisionRight value", () => {
    const decisionRights = new Set(engagementSignalInviteList.map((entry) => entry.decisionRight));
    expect(decisionRights.has("not-informed" as never)).toBe(false);
  });

  it("[negative example] a decisionRight value of 'not-informed' would be a timing value miscast as a decision right", () => {
    const misused = { decisionRight: "not-informed", informationTiming: "not-informed" };
    expect(misused.decisionRight).not.toBe("none");
    expect(misused.decisionRight).toBe(misused.informationTiming);
  });
});

describe("Week 8 and Week 9 keep documented fact, inference and unknown as three distinct labels", () => {

  it("Week 8's phase-order comparison table labels a documented fact, an undocumented gap, and an unknown", () => {
    expect(week8).toMatch(/\*\*documented\*\*/i);
    expect(week8).toMatch(/not documented\*\*/i);
    expect(week8).toMatch(/\*\*unknown\*\*/i);
  });

  it("Week 8 marks Castellano's folded-in reading as an inference, not a stated fact", () => {
    expect(week8).toMatch(/is an \*inference\* from one unaddressed/i);
  });

  it("Week 9's sign-off chain table uses more than one evidentiary status, including unknown and inference", () => {
    const documentedFactCount = (week9.match(/Documented fact/gi) || []).length;
    expect(documentedFactCount).toBeGreaterThan(0);
    expect(week9).toMatch(/\*\*unknown\*\*/i);
    expect(week9).toMatch(/\*\*inference\*\*, not fact/i);
  });

  it("[negative example] a table that calls every step 'Documented fact' has collapsed the distinction", () => {
    const flattened = "Documented fact | Documented fact | Documented fact | Documented fact";
    expect(flattened).not.toMatch(/\*\*unknown\*\*/i);
    expect(flattened).not.toMatch(/\*\*inference\*\*/i);
  });
});

describe("Week 9 doesn't inflate a single signature into independently exercised delegated authority", () => {
  // The memo proves two things: the AUD 420,000 figure, and that Oyelaran
  // signed it. It does not prove she was the only participant, that no
  // other approval step existed, or that a lone signature is complete
  // spending authorisation — a past drift stated all of that as documented
  // fact. These tests protect the narrower, corrected claim without
  // re-checking the whole file line by line.
  it("step 1's row marks the figure and signature as documented fact", () => {
    expect(week9).toMatch(/Documented fact: the figure and the signature exist/i);
  });

  it("step 1's row marks 'alone', no other approval step, and complete authority as inference, not fact", () => {
    expect(week9).toMatch(
      /\*\*Inference, not fact\*\*: that she was the only participant, that no other approval step took place/i,
    );
  });

  it("the prose states the memo alone cannot settle the full approval structure, without inventing a delegation document", () => {
    expect(week9).toMatch(/the memo alone cannot settle it either way/i);
    expect(week9).not.toMatch(/delegation (?:policy|document) (?:states|confirms|shows)/i);
  });

  it("the signature is still not called a vote", () => {
    expect(week9).toMatch(/step 1 is not a vote just because it decided/i);
  });

  it("[negative example] the old row calling 'alone' a documented fact reproduces the overclaim", () => {
    const oldRow =
      "Signs off the AUD $420,000 ClarityPulse budget line, alone | **Approval — spending authority**, not a vote: one named signatory, no other participant, no ballot | Documented fact";
    expect(oldRow).toMatch(/, alone \|.*Documented fact\s*$/is);
  });
});

describe("Student-facing hub pages each render exactly one <h1>", () => {
  // ContentLayout (astro-theme-university) renders an <h1> from the page's
  // `title` prop whenever there's no hero image; several of these pages also
  // open with a Markdown '# Heading'. Checking the *built* HTML, not the
  // source, is the only way to catch a page that ends up with two headings
  // (or a layout regression that drops the heading entirely) — the same
  // reason spec/decision-autopsy-timezone.test.ts and the rendered half of
  // spec/role-card-fields.test.ts read from dist/ rather than source.
  const hubPages = [
    "dist/index.html",
    "dist/assessments/index.html",
    "dist/lectures/index.html",
    "dist/sessions/index.html",
    "dist/people/index.html",
    "dist/policies/index.html",
    "dist/templates/index.html",
    "dist/alignment-lab/index.html",
  ];

  it("has one and only one <h1> per hub page", () => {
    for (const path of hubPages) {
      const html = readFileSync(resolve(path), "utf8");
      const count = (html.match(/<h1[\s>]/gi) || []).length;
      expect(count, `${path} has ${count} <h1> elements, expected exactly 1`).toBe(1);
    }
  });

  it("[negative example] a page with a duplicated heading (layout h1 plus a Markdown h1) is caught", () => {
    const broken = "<h1>Assessment</h1><p>...</p><h1>Assessment</h1>";
    const count = (broken.match(/<h1[\s>]/gi) || []).length;
    expect(count).not.toBe(1);
  });

  it("[negative example] a page missing its heading entirely is caught", () => {
    const broken = "<p>No heading here.</p>";
    const count = (broken.match(/<h1[\s>]/gi) || []).length;
    expect(count).not.toBe(1);
  });
});
