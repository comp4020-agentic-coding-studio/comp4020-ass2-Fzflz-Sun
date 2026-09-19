// The Alignment Lab's "Consequences, from stated rules" section
// (src/pages/alignment-lab/index.mdx) used to argue its rules entirely in
// Markdown prose. That made the rule un-testable except by grepping the
// page's own wording — a check that a later edit could satisfy just by
// keeping the right words nearby, without the rule actually being applied
// consistently. This module is the rule itself, as a small pure function,
// so the page can render a result the function actually produced, and
// spec/consequence-rules.test.ts can throw synthetic records at it.
//
// The rule separates three kinds of authority a decision record can name,
// because the worked example's own scenario turns on them not being the same
// thing:
//   - final decision authority: who signs off on the decision going forward
//   - spending authority: who can actually authorise the money moving
//   - implementation authority: who can act on the decision in the world
//     (this module does not evaluate implementation authority numerically —
//     the worked example treats it as a plain consequence of the cost
//     branch: nothing implementation-shaped may proceed until spend is
//     authorised — but it is named here so the type vocabulary matches the
//     page's prose and cannot silently collapse back into "final authority
//     means you can also spend and build").

export type AuthorityKind = "final-decision" | "spending" | "implementation";

export interface MissingFigure {
  name: string;
  owner: string;
  deadline: string;
}

export interface CostAuthorityInput {
  /** Is there a named final decision authority at all? Checked first: */
  /** without one, there is no one for a deferred figure to come back to. */
  finalAuthorityNamed: boolean;
  /**
   * The bug this field exists to catch: a record that treats its named
   * final decision authority's sign-off as if it were itself spending
   * authority, rather than a separate authority that still has to be
   * obtained. When true, this always sends the record to revision,
   * regardless of how complete the costing is.
   */
  finalAuthorityTreatedAsSpendingAuthority: boolean;
  /** Is the cost figure complete, with nothing left unstated? */
  costFullyKnown: boolean;
  /** Only meaningful when costFullyKnown is false: the specific gap named. */
  missingFigure?: MissingFigure;
  /**
   * Only meaningful when missingFigure is set: does the record explicitly
   * prohibit the dependent spend until the figure is confirmed and validly
   * approved? False here is what distinguishes "genuinely defers spend"
   * from "names the gap but spends through it anyway".
   */
  dependentSpendWithheldUntilConfirmed: boolean;
  /**
   * Has someone who actually holds spending authority (not merely final
   * decision authority) approved the spend? Only load-bearing when
   * costFullyKnown is true — a deferred record hasn't reached this question
   * yet, which is exactly why "delayed" and "accepted" are different
   * outcomes.
   */
  spendingAuthorityGranted: boolean;
}

export type CostAuthorityCause =
  | "no-final-authority"
  | "final-authority-mistaken-for-spending-authority"
  | "vague-cost"
  | "named-gap-but-spent-through"
  | "fully-costed-but-no-valid-spending-authority";

export type CostAuthorityOutcome =
  | { bucket: "accepted"; consequence: "accepted"; reason: string }
  | {
      bucket: "deferred";
      consequence: "delayed";
      reason: string;
      missingFigure: MissingFigure;
    }
  | { bucket: "revision"; consequence: "revision"; reason: string; cause: CostAuthorityCause };

/**
 * Rule 1 (final decision authority) and rule 2 (cost status), combined and
 * corrected so that naming a final decision authority is never conflated
 * with obtaining spending authority. Every input lands in exactly one of
 * three consequences: accepted, delayed, or sent back for revision.
 */
export function evaluateCostAndAuthority(input: CostAuthorityInput): CostAuthorityOutcome {
  if (!input.finalAuthorityNamed) {
    return {
      bucket: "revision",
      consequence: "revision",
      cause: "no-final-authority",
      reason: "no named final decision authority to send a deferred figure back to",
    };
  }

  if (input.finalAuthorityTreatedAsSpendingAuthority) {
    return {
      bucket: "revision",
      consequence: "revision",
      cause: "final-authority-mistaken-for-spending-authority",
      reason:
        "the record treats the named final decision authority's sign-off as spending authority, which it is not",
    };
  }

  if (input.costFullyKnown) {
    if (input.spendingAuthorityGranted) {
      return {
        bucket: "accepted",
        consequence: "accepted",
        reason: "the figure is complete and the spend was approved by someone with actual spending authority",
      };
    }
    return {
      bucket: "revision",
      consequence: "revision",
      cause: "fully-costed-but-no-valid-spending-authority",
      reason: "the figure is complete, but no one with actual spending authority has approved the spend",
    };
  }

  const figure = input.missingFigure;

  if (!figure || figure.name.trim() === "" || figure.owner.trim() === "" || figure.deadline.trim() === "") {
    return {
      bucket: "revision",
      consequence: "revision",
      cause: "vague-cost",
      reason: "the record gestures at an unconfirmed cost without naming the figure, its owner, or a deadline",
    };
  }

  if (!input.dependentSpendWithheldUntilConfirmed) {
    return {
      bucket: "revision",
      consequence: "revision",
      cause: "named-gap-but-spent-through",
      reason:
        "the record names the missing figure and its owner but still authorises the dependent spend before it is confirmed",
    };
  }

  return {
    bucket: "deferred",
    consequence: "delayed",
    reason:
      "the record names the missing figure, its owner and a deadline, and explicitly withholds dependent spend until it is confirmed and validly approved",
    missingFigure: figure,
  };
}

export type RoleFieldStatus = true | false | "undetermined";

export interface RoleRuleInput {
  role: string;
  minimumOutcomeMet: RoleFieldStatus;
  constraintMet: RoleFieldStatus;
}

export type RoleRuleStatus = "clear" | "contested" | "undetermined";

export interface RoleRuleOutcome {
  role: string;
  status: RoleRuleStatus;
  reason: string;
}

/**
 * Rule 3: checks a role's stated minimum acceptable outcome and its
 * non-tradeable constraint jointly, not as alternatives. Meeting one never
 * excuses failing the other, and a field the record does not actually state
 * is reported as undetermined rather than guessed at in either direction.
 */
export function evaluateRoleRule(input: RoleRuleInput): RoleRuleOutcome {
  const { role, minimumOutcomeMet, constraintMet } = input;

  if (minimumOutcomeMet === false || constraintMet === false) {
    const failedField =
      minimumOutcomeMet === false && constraintMet === false
        ? "both the minimum outcome and the constraint"
        : minimumOutcomeMet === false
          ? "the minimum outcome"
          : "the constraint";
    return {
      role,
      status: "contested",
      reason: `${failedField} is not met by the record`,
    };
  }

  if (minimumOutcomeMet === "undetermined" || constraintMet === "undetermined") {
    return {
      role,
      status: "undetermined",
      reason: "the record does not state enough to determine this role's outcome and/or constraint either way",
    };
  }

  return { role, status: "clear", reason: "both the minimum outcome and the constraint are met by the record" };
}

// --- The worked hot-desking example, encoded as data so the page can render
// a result this function actually computed, not a hand-written paraphrase of
// one. See src/pages/alignment-lab/index.mdx, "Consequences, from stated
// rules", for the same result argued out in prose.

export const hotDeskingCostAuthorityInput: CostAuthorityInput = {
  finalAuthorityNamed: true,
  finalAuthorityTreatedAsSpendingAuthority: false,
  costFullyKnown: false,
  missingFigure: {
    name: "the accessibility fit-out cost",
    owner: "Staff Representative",
    deadline: "within one week",
  },
  dependentSpendWithheldUntilConfirmed: true,
  spendingAuthorityGranted: false,
};

export const hotDeskingRoleRuleInputs: RoleRuleInput[] = [
  { role: "Delivery Lead", minimumOutcomeMet: true, constraintMet: true },
  { role: "Staff Representative", minimumOutcomeMet: true, constraintMet: true },
  { role: "Finance and Risk Lead", minimumOutcomeMet: false, constraintMet: true },
  { role: "Executive Sponsor", minimumOutcomeMet: "undetermined", constraintMet: "undetermined" },
];

export const hotDeskingCostAuthorityOutcome = evaluateCostAndAuthority(hotDeskingCostAuthorityInput);
export const hotDeskingRoleRuleOutcomes = hotDeskingRoleRuleInputs.map(evaluateRoleRule);
