import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The Alignment Lab worked example's "Consequences, from stated rules"
// section (src/pages/alignment-lab/index.mdx) is the only place the cost
// rule and the per-role rule are written out in full. Nothing type-checks
// this prose against a real implementation — it's argued in Markdown, not
// executed — so these checks grep the page source directly, the same
// approach spec/case-consistency.test.ts and spec/templates-consistency.test.ts
// already use for prose that has to stay internally consistent.

const labGuide = readFileSync(resolve("src/pages/alignment-lab/index.mdx"), "utf8");

describe("Consequence rule 2 (cost status) is exhaustive across all three branches", () => {
  it("states the branch is exhaustive: every record lands in exactly one of three buckets", () => {
    expect(labGuide).toMatch(/exactly one of three buckets/i);
  });

  it("names the fully-costed branch: accepted as submitted, no delay", () => {
    expect(labGuide).toMatch(/\*\*fully costed\*\*/i);
    expect(labGuide).toMatch(/accepts the plan as submitted/i);
  });

  it("names the genuine-deferral branch: a named, specific figure with spend actually withheld", () => {
    expect(labGuide).toMatch(
      /genuinely defers spend pending a named, specific figure/i,
    );
    expect(labGuide).toMatch(/two-week delay/i);
  });

  it("names the third branch, and that third branch explicitly covers naming the gap while still spending through it", () => {
    expect(labGuide).toMatch(/uncosted and spent through anyway/i);
    // The bug this guards: an earlier draft of this rule only covered a
    // record that never names a missing figure at all. The rule as written
    // now also catches a record that *does* name the figure and its owner
    // but still authorises the dependent spend as if it had already landed
    // — naming the gap alone must not be enough to escape into the milder,
    // two-week-delay branch.
    expect(labGuide).toMatch(
      /does name the missing figure\s+and its owner but still authorises the dependent spend/i,
    );
    expect(labGuide).toMatch(/naming the gap does not move a record out of this branch/i);
  });

  it("[negative example] a rule that only asks 'does the record name a missing figure' would miss the new branch", () => {
    const oldRule =
      "If the record names a missing figure, treat it as a genuine deferral; " +
      "otherwise send it back for revision.";
    expect(oldRule).not.toMatch(
      /does name the missing figure\s+and its owner but still authorises the dependent spend/i,
    );
  });
});

describe("Consequence rule 3 (role rule) checks minimum outcome and constraint jointly, not as alternatives", () => {
  it("states both fields are checked together, not as alternatives", () => {
    expect(labGuide).toMatch(
      /does the record satisfy\s+\*both\* that role's stated minimum acceptable outcome \*and\* their\s+non-tradeable constraint/i,
    );
    expect(labGuide).toMatch(/checked together rather\s+than as alternatives/i);
  });

  it("neither field excuses a gap in the other", () => {
    expect(labGuide).toMatch(
      /meeting the minimum outcome does not excuse\s+silently overriding the constraint/i,
    );
    expect(labGuide).toMatch(
      /honouring the constraint does\s+not excuse falling short of the minimum outcome/i,
    );
  });

  it("allows a role's outcome-or-constraint call to be left undetermined, not guessed at, when the record doesn't say", () => {
    // The worked example's Executive Sponsor row is the concrete instance:
    // both halves are reported as undetermined, distinct from "clear" or
    // "contested", because the record doesn't state a resulting utilisation
    // figure or the sponsor's reporting-window start date.
    expect(labGuide).toMatch(/both fields undetermined from the record/i);
    expect(labGuide).toMatch(/cannot be determined from this\s+record/i);
    // The rule explicitly forbids forcing an undetermined call into either
    // resolved bucket — this must appear as something the rule warns
    // against, not something the rule does.
    expect(labGuide).toMatch(/not rounded up to "clear" or down to\s+"contested"/i);
  });

  it("[negative example] a rule phrased as 'either the outcome or the constraint' would not require both", () => {
    const oldRule =
      "A role is clear if the record satisfies either its stated minimum " +
      "acceptable outcome or its non-tradeable constraint.";
    expect(oldRule).not.toMatch(/\*both\*/i);
    expect(oldRule).toMatch(/either/i);
  });
});
