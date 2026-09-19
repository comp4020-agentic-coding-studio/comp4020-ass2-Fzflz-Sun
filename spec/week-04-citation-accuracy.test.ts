import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Week 4's further-reading section links Cornell Law School's Wex entry on
// "Circumstantial Evidence". That page (confirmed by direct fetch) only
// defines circumstantial evidence as indirect evidence requiring an
// additional reasonable inference, illustrated with one example — it says
// nothing about reaching a conclusion beyond reasonable doubt, nothing about
// a larger stack of evidence not being automatically stronger, and nothing
// about each piece needing to independently exclude an innocent explanation.
// A past draft attributed all three of those claims to the page. These tests
// protect the corrected version: the page is credited only with the
// definition/inference distinction, and "stacking" is explicitly labelled as
// this course's own extension, not the source's claim.

const week4 = readFileSync(resolve("src/content/lectures/week-04.md"), "utf8");

describe("Week 4's Cornell Wex citation states only what the source supports", () => {
  it("still links the Cornell Wex entry", () => {
    expect(week4).toMatch(/law\.cornell\.edu\/wex\/circumstantial_evidence/);
  });

  it("credits the page with the definition/inference distinction it actually states", () => {
    expect(week4).toMatch(/indirect\s+evidence/i);
    expect(week4).toMatch(/additional reasonable inference/i);
  });

  it("explicitly labels 'stacking' and the burden-of-proof standard as the course's own extension, not the source's", () => {
    expect(week4).toMatch(/this course's own extension, not the\s*\nsource's/i);
  });

  it("does not attribute the beyond-reasonable-doubt standard to the linked page", () => {
    expect(week4).not.toMatch(
      /it states plainly: circumstantial evidence can support a conclusion beyond\s*\nreasonable doubt/i,
    );
  });

  it("does not attribute a 'larger stack is not automatically stronger' claim to the page", () => {
    expect(week4).not.toMatch(/entry's own warning against treating a \*larger\* stack/i);
  });

  it("does not attribute an 'each piece must independently exclude the innocent explanation' standard to the page", () => {
    expect(week4).not.toMatch(/whether each piece independently narrows out the\s*\ninnocent explanation is/i);
  });

  it("[negative example] the old wording reproduces all three unsupported attributions", () => {
    const oldWording =
      "Read it for the one distinction it states plainly: circumstantial evidence can support a conclusion beyond reasonable doubt, but no single piece of it is expected to carry that weight alone — the same shape as this week's \"stacking\" argument. Read it for one purpose: the entry's own warning against treating a *larger* stack of circumstantial evidence as automatically stronger than a smaller one — quantity isn't the test; whether each piece independently narrows out the innocent explanation is.";
    expect(oldWording).toMatch(/beyond reasonable doubt/i);
    expect(oldWording).toMatch(/entry's own warning against treating a \*larger\* stack/i);
    expect(oldWording).toMatch(/independently narrows out the innocent explanation/i);
  });
});
