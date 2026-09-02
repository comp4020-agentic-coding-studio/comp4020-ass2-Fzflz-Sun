// Canonical rules for the Alignment Lab: the internal scoring split (100% of
// the Lab's own mark, not to be confused with the Lab's 45% weight in the
// whole-course total — see `src/content/assessments/alignment-lab.md`), the
// step-by-step process, and the pre-meeting contact limit.
//
// `spec/alignment-lab-scoring.test.ts` reads the built assessment page and
// checks its `marking.criteria` against `labScoring` below, so the numbers
// on the page and the numbers here cannot silently drift apart.

export interface LabScoringCriterion {
  name: string;
  weight: number;
  level: "individual" | "group";
}

// Marked on evidence use, adaptation and ethical judgement — never on
// negotiation win/loss, performance skill, talking frequency, or whether a
// person's role-goal was achieved.
export const labScoring: LabScoringCriterion[] = [
  { name: "Initial judgment and strategy memo", weight: 20, level: "individual" },
  {
    name: "Pre-meeting negotiation: evidence, purpose and adaptation",
    weight: 20,
    level: "individual",
  },
  { name: "Formal decision record", weight: 15, level: "group" },
  { name: "Individual decision autopsy", weight: 35, level: "individual" },
  { name: "Partial rerun and improvement explanation", weight: 10, level: "individual" },
];

export const MAX_SELF_INITIATED_CONTACTS = 2;

export interface LabStep {
  step: number;
  title: string;
  detail: string;
}

export const labProcessSteps: LabStep[] = [
  {
    step: 0,
    title: "Rehearsal",
    detail:
      "An ungraded, small-scale run of the whole process, using the public worked " +
      "example on this page, before anyone sits the assessed Lab.",
  },
  {
    step: 1,
    title: "Public materials and initial judgment",
    detail:
      "Before any role is assigned, everyone reads the same public materials and " +
      "submits an individual initial judgment of what should happen — on the record, " +
      "before anyone has a stake in a role.",
  },
  {
    step: 2,
    title: "Role assignment and strategy memo",
    detail:
      "Each person receives one confidential role brief and, individually, submits a " +
      "one-page strategy memo: their responsibilities, their evidence, what they don't " +
      "know, who they plan to contact, and the ethical boundaries they won't cross.",
  },
  {
    step: 3,
    title: "Pre-meeting negotiation window",
    detail:
      `A 48–72 hour window. Each person may make at most ${MAX_SELF_INITIATED_CONTACTS} ` +
      "self-initiated contacts by default, but can reply to as many requests from " +
      "others as they like. Every contact is logged by both parties: its purpose, any " +
      "new information, any commitments made, and whether either person's judgment " +
      "changed.",
  },
  {
    step: 4,
    title: "The meeting",
    detail: "A single, roughly 25-minute sitting. No extensions once the clock starts.",
  },
  {
    step: 5,
    title: "Decision record",
    detail:
      "The group produces one record: the decision (or a reasoned deferral), who holds " +
      "final authority over it, what is evidence versus unverified assumption, any " +
      "unresolved dissent, who owns the resulting actions, and what would reopen it. " +
      "Consensus is not required.",
  },
  {
    step: 6,
    title: "Reveal and consequence test",
    detail:
      "Every role brief is published to the whole group, then a choice-based " +
      "consequence test runs against the decision record. Its outcomes are produced by " +
      "explicit, traceable case rules, not by chance or dramatic licence, and it is a " +
      "teaching model of one plausible consequence — not a claim that any real decision " +
      "like it would play out the same way.",
  },
  {
    step: 7,
    title: "Individual autopsy and partial rerun",
    detail:
      "Individually: a decision autopsy naming what you now think actually decided the " +
      "outcome, then a short rerun of one specific juncture to test whether a named " +
      "process change would have produced a different one.",
  },
];
