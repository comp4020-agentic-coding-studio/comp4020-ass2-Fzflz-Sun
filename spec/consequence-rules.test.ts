import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  type CostAuthorityInput,
  evaluateCostAndAuthority,
  evaluateRoleRule,
  hotDeskingCostAuthorityInput,
  hotDeskingCostAuthorityOutcome,
  hotDeskingRoleRuleOutcomes,
} from "../src/data/consequence-rules";

// The Alignment Lab worked example's "Consequences, from stated rules"
// section used to be argued only in Markdown prose, checked here by
// grepping the page for keywords — which proved the right words were
// nearby, not that a rule was exhaustive, exclusive, or correctly executed.
// evaluateCostAndAuthority and evaluateRoleRule (src/data/consequence-rules.ts)
// are the rule itself; these tests throw synthetic records at the function,
// the same way a real regression (a rule that quietly let a mistaken
// authority claim through, or rounded an undetermined role call up to
// "clear") would actually be caught.

function baseCostInput(overrides: Partial<CostAuthorityInput> = {}): CostAuthorityInput {
  return {
    finalAuthorityNamed: true,
    finalAuthorityTreatedAsSpendingAuthority: false,
    costFullyKnown: false,
    dependentSpendWithheldUntilConfirmed: false,
    spendingAuthorityGranted: false,
    ...overrides,
  };
}

describe("evaluateCostAndAuthority covers every authority/cost combination", () => {
  it("fully costed + valid spending authority granted -> accepted", () => {
    const outcome = evaluateCostAndAuthority(
      baseCostInput({ costFullyKnown: true, spendingAuthorityGranted: true }),
    );
    expect(outcome.consequence).toBe("accepted");
  });

  it("named figure + owner + deadline + spend genuinely deferred -> delayed", () => {
    const outcome = evaluateCostAndAuthority(
      baseCostInput({
        costFullyKnown: false,
        missingFigure: { name: "fit-out cost", owner: "Staff Representative", deadline: "one week" },
        dependentSpendWithheldUntilConfirmed: true,
      }),
    );
    expect(outcome.consequence).toBe("delayed");
    if (outcome.bucket === "deferred") {
      expect(outcome.missingFigure.owner).toBe("Staff Representative");
    }
  });

  it("vague missing cost, no figure/owner/deadline named -> revision", () => {
    const outcome = evaluateCostAndAuthority(baseCostInput({ costFullyKnown: false }));
    expect(outcome.consequence).toBe("revision");
    if (outcome.bucket === "revision") {
      expect(outcome.cause).toBe("vague-cost");
    }
  });

  it("named missing figure but dependent spend immediately authorised anyway -> revision", () => {
    const outcome = evaluateCostAndAuthority(
      baseCostInput({
        costFullyKnown: false,
        missingFigure: { name: "fit-out cost", owner: "Staff Representative", deadline: "one week" },
        dependentSpendWithheldUntilConfirmed: false,
      }),
    );
    expect(outcome.consequence).toBe("revision");
    if (outcome.bucket === "revision") {
      expect(outcome.cause).toBe("named-gap-but-spent-through");
    }
  });

  it("fully costed but no valid spending authority granted -> revision, not accepted", () => {
    const outcome = evaluateCostAndAuthority(
      baseCostInput({ costFullyKnown: true, spendingAuthorityGranted: false }),
    );
    expect(outcome.consequence).toBe("revision");
    if (outcome.bucket === "revision") {
      expect(outcome.cause).toBe("fully-costed-but-no-valid-spending-authority");
    }
  });

  it("final decision authority exists but is not itself spending authority -> must not pass as accepted", () => {
    // A record naming a final decision authority and nothing else about
    // spending must never be treated as though spending authority follows
    // automatically from that. Fully costed with no spending authority
    // granted covers exactly this case.
    const outcome = evaluateCostAndAuthority(
      baseCostInput({
        finalAuthorityNamed: true,
        costFullyKnown: true,
        spendingAuthorityGranted: false,
      }),
    );
    expect(outcome.consequence).not.toBe("accepted");
  });

  it("record treats the final decision authority's sign-off as spending authority -> revision, regardless of costing", () => {
    const outcome = evaluateCostAndAuthority(
      baseCostInput({
        finalAuthorityTreatedAsSpendingAuthority: true,
        costFullyKnown: true,
        spendingAuthorityGranted: true,
      }),
    );
    expect(outcome.consequence).toBe("revision");
    if (outcome.bucket === "revision") {
      expect(outcome.cause).toBe("final-authority-mistaken-for-spending-authority");
    }
  });

  it("no named final decision authority -> revision, before anything else is considered", () => {
    const outcome = evaluateCostAndAuthority(
      baseCostInput({ finalAuthorityNamed: false, costFullyKnown: true, spendingAuthorityGranted: true }),
    );
    expect(outcome.consequence).toBe("revision");
    if (outcome.bucket === "revision") {
      expect(outcome.cause).toBe("no-final-authority");
    }
  });

  it("[negative example] a rule that only asked 'does the record name a missing figure' would wrongly accept a named-but-spent-through record", () => {
    const oldRuleAccepts = (hasNamedFigure: boolean) => hasNamedFigure;
    // The real rule rejects this record (spends through a named gap); the
    // old, weaker rule would have waved it through on the figure alone.
    expect(oldRuleAccepts(true)).toBe(true);
    const outcome = evaluateCostAndAuthority(
      baseCostInput({
        costFullyKnown: false,
        missingFigure: { name: "fit-out cost", owner: "Staff Representative", deadline: "one week" },
        dependentSpendWithheldUntilConfirmed: false,
      }),
    );
    expect(outcome.consequence).not.toBe("accepted");
    expect(outcome.consequence).not.toBe("delayed");
  });
});

describe("evaluateRoleRule checks minimum outcome and constraint jointly", () => {
  it("role minimum met but constraint violated -> contested", () => {
    const outcome = evaluateRoleRule({ role: "Test Role", minimumOutcomeMet: true, constraintMet: false });
    expect(outcome.status).toBe("contested");
  });

  it("constraint met but minimum unmet -> contested", () => {
    const outcome = evaluateRoleRule({ role: "Test Role", minimumOutcomeMet: false, constraintMet: true });
    expect(outcome.status).toBe("contested");
  });

  it("both met -> clear", () => {
    const outcome = evaluateRoleRule({ role: "Test Role", minimumOutcomeMet: true, constraintMet: true });
    expect(outcome.status).toBe("clear");
  });

  it("evidence insufficient (both undetermined) -> undetermined, not guessed", () => {
    const outcome = evaluateRoleRule({
      role: "Test Role",
      minimumOutcomeMet: "undetermined",
      constraintMet: "undetermined",
    });
    expect(outcome.status).toBe("undetermined");
  });

  it("one field undetermined and the other true -> undetermined, not rounded up to clear", () => {
    const outcome = evaluateRoleRule({ role: "Test Role", minimumOutcomeMet: true, constraintMet: "undetermined" });
    expect(outcome.status).toBe("undetermined");
  });

  it("one field false and the other undetermined -> contested, not softened to undetermined", () => {
    // A known failure is not made uncertain by an unrelated unknown field —
    // contested still wins over undetermined when either field is actually false.
    const outcome = evaluateRoleRule({ role: "Test Role", minimumOutcomeMet: false, constraintMet: "undetermined" });
    expect(outcome.status).toBe("contested");
  });

  it("[negative example] a rule phrased as 'either the outcome or the constraint' would not catch a role that fails only one", () => {
    const oldRuleClear = (outcomeMet: boolean, constraintMet: boolean) => outcomeMet || constraintMet;
    // Old, wrong rule: meeting either field alone was enough.
    expect(oldRuleClear(true, false)).toBe(true);
    // Real rule: meeting only one is not enough — the record is contested.
    const outcome = evaluateRoleRule({ role: "Test Role", minimumOutcomeMet: true, constraintMet: false });
    expect(outcome.status).not.toBe("clear");
  });
});

describe("The worked hot-desking example's exported outcome is what the function actually computed", () => {
  it("re-running evaluateCostAndAuthority on the exported input reproduces the exported outcome", () => {
    expect(evaluateCostAndAuthority(hotDeskingCostAuthorityInput)).toEqual(hotDeskingCostAuthorityOutcome);
  });

  it("the worked example is a genuine deferral, not an acceptance or a revision", () => {
    expect(hotDeskingCostAuthorityOutcome.consequence).toBe("delayed");
  });

  it("the worked example's four roles resolve to clear, clear, contested, undetermined in that order", () => {
    expect(hotDeskingRoleRuleOutcomes.map((o) => o.status)).toEqual([
      "clear",
      "clear",
      "contested",
      "undetermined",
    ]);
  });
});

describe("The Alignment Lab guide's prose stays consistent with the evaluator's vocabulary", () => {
  const labGuide = readFileSync(resolve("src/pages/alignment-lab/index.mdx"), "utf8");

  it("names all three kinds of authority: final decision, spending, and implementation", () => {
    expect(labGuide).toMatch(/\*\*final decision authority\*\*/i);
    expect(labGuide).toMatch(/\*\*spending authority\*\*/i);
    expect(labGuide).toMatch(/\*\*implementation authority\*\*/i);
  });

  it("states that naming a final decision authority does not establish spending authority", () => {
    expect(labGuide).toMatch(/does\s+\*\*not\*\*, on its own,\s+mean you hold spending authority/i);
  });

  it("states the exhaustive three-branch cost-and-authority outcome, including the corrected 'fully costed and validly authorised' branch", () => {
    expect(labGuide).toMatch(/fully costed and validly authorised/i);
    expect(labGuide).toMatch(/specific cost explicitly deferred/i);
    expect(labGuide).toMatch(
      /uncosted, prematurely authorised, or authorised by the wrong\s+authority/i,
    );
  });

  it("imports the evaluator from src/data/consequence-rules rather than re-deriving the result by hand", () => {
    expect(labGuide).toMatch(/from ["']\.\.\/\.\.\/data\/consequence-rules["']/);
  });

  it("[negative example] prose that only names 'a named final authority' without distinguishing spending authority reproduces the old conflation bug", () => {
    const oldRule = "Is there a named final authority? If no, send the record back for revision.";
    expect(oldRule).not.toMatch(/spending authority/i);
  });
});
