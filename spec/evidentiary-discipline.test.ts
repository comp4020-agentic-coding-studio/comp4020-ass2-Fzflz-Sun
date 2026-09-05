import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { engagementSignalInviteList } from "../src/data/case-facts";

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
});

describe("Week 8 and Week 9 keep documented fact, inference and unknown as three distinct labels", () => {
  const week8 = readFileSync(
    resolve("src/content/sessions/08-dissent-without-disappearing.md"),
    "utf8",
  );
  const week9 = readFileSync(resolve("src/content/sessions/09-who-actually-decides.md"), "utf8");

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
