import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The Alignment Lab's live, async make-up and alternative/structured-async
// pathways share one weighting (20/20/15/35/10) but submit evidence of
// different natures. An earlier draft asserted the three were "naturally
// equivalent" without ever writing out why, folded a student who missed
// role assignment entirely into the same async make-up as one who only
// missed the live meeting, and had the alternative pathway "analyse" or
// "comment on" the page's own worked example rather than produce anything
// independently. These tests check the corrected version: the two async
// cases are named and kept apart, the alternative pathway builds its own
// artefacts from the Contact Simulator or frozen transcripts, and every one
// of the five criteria states in prose why its evidentiary strength is held
// to be equivalent, not merely parallel, across all three pathways.

const labGuide = readFileSync(resolve("src/pages/alignment-lab/index.mdx"), "utf8");
const assessmentBrief = readFileSync(resolve("src/content/assessments/alignment-lab.md"), "utf8");
const policies = readFileSync(resolve("src/pages/policies/index.mdx"), "utf8");
const templatesPage = readFileSync(resolve("src/pages/templates/index.mdx"), "utf8");

describe("Async make-up is split into two distinct, clearly-named cases", () => {
  it("names case (a): had a role and the contact window, missed only the live meeting", () => {
    expect(labGuide).toMatch(
      /\(a\) You were assigned a role and had the contact window, but missed\s*\n\s*only the live meeting itself/i,
    );
  });

  it("names case (b): missed role assignment or the contact window itself", () => {
    expect(labGuide).toMatch(
      /\(b\) You missed role assignment or the contact window itself, not only\s*\n\s*the meeting/i,
    );
  });

  it("case (a) explicitly forbids reconstructing your own contact history from the group's materials", () => {
    expect(labGuide).toMatch(
      /do not reconstruct or rewrite them from the group's\s*\n\s*materials after the fact/i,
    );
  });

  it("case (b) is explicitly not folded into case (a), and is routed to the alternative pathway instead", () => {
    expect(labGuide).toMatch(/This is not folded into case \(a\) above/i);
    expect(labGuide).toMatch(/routed\s*\n\s*to the \*\*alternative \/ structured-async pathway\*\*/i);
  });

  it("[negative example] the old undifferentiated wording folded every make-up case into one path", () => {
    const oldWording =
      "If you miss the live meeting itself, but were assigned a role and your group did meet and produce a decision record, you complete an asynchronous equivalent within one week of receiving that record.";
    expect(oldWording).not.toMatch(/\(a\) You were assigned a role/i);
    expect(oldWording).not.toMatch(/\(b\) You missed role assignment/i);
  });
});

describe("Case (a)'s formal decision record criterion is a genuine audit task, not passive analysis", () => {
  it("requires auditing the group's record against the full reveal pack and submitting a corrected/reconstructed record", () => {
    expect(labGuide).toMatch(/audit\s*\n?\s*the group's actual decision record against the full reveal pack/i);
    expect(labGuide).toMatch(/submit your own corrected or reconstructed decision record/i);
  });

  it("is scored against the same eight fields and standard as a live record, not against matching the original", () => {
    expect(labGuide).toMatch(/same eight fields and the same quality standard as a live record/i);
    expect(labGuide).toMatch(/not\s*\n\s*against whether it matches the group's original/i);
  });
});

describe("The alternative / structured-async pathway independently produces its own artefacts", () => {
  it("uses the Contact Simulator or frozen transcripts to build the negotiation log, not analysis of the example log", () => {
    expect(labGuide).toMatch(/Playing one role through the\s*\n\s*Contact Simulator/i);
    expect(labGuide).toMatch(/frozen contact transcripts/i);
  });

  it("logs purpose, new information, commitment and judgment change at each contact node", () => {
    expect(labGuide).toMatch(
      /log its purpose,\s*\n\s*the new information it surfaced, any commitment made, and whether your\s*\n\s*judgment changed/i,
    );
  });

  it("independently produces its own decision record rather than analysing the example one", () => {
    expect(labGuide).toMatch(
      /independently produce your own\s*\n\s*decision record, in the same format as Section 5's/i,
    );
  });

  it("explicitly says every artefact is produced, not a commentary on a finished answer", () => {
    expect(labGuide).toMatch(
      /Every artefact you submit is\s*\n\s*one you produced, not an analysis of one the page already gives you a\s*\n\s*finished answer for/i,
    );
  });

  it("[negative example] the old alternative task only asked students to analyse the existing example log", () => {
    const oldWording =
      "a negotiation log you construct by analysing the example log above rather than living it, a written analysis of the example decision record in Section 5";
    expect(oldWording).toMatch(/analysing the example log/i);
    expect(oldWording).toMatch(/written analysis of the example decision record/i);
  });
});

describe("The criterion table names three pathways and gives an adapted cell for all five criteria", () => {
  it("the table header names Live, Async make-up, and Alternative / structured-async", () => {
    expect(labGuide).toMatch(
      /\| Criterion \(weight, level\) \| Live \| Async make-up \| Alternative \/ structured-async \|/,
    );
  });

  const criterionRowLabels = [
    "Initial judgment & strategy memo",
    "Pre-meeting negotiation",
    "Formal decision record",
    "Individual decision autopsy",
    "Partial rerun",
  ];

  it.each(criterionRowLabels)("the table has a row for: %s", (label) => {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    expect(labGuide).toMatch(new RegExp(`\\| ${escaped} `));
  });

  it("[negative example] the old table only had 'Alternative (opt-out)' with no case split", () => {
    const oldHeader = "| Criterion (weight, level) | Live | Async make-up | Alternative (opt-out) |";
    expect(oldHeader).not.toMatch(/Alternative \/ structured-async/);
  });
});

describe("A written equivalence standard exists for every one of the five criteria, not an assertion of 'naturally equivalent'", () => {
  const equivalenceHeadingsSource = labGuide;

  it("has its own 'Why each row is equivalent' section, distinct from the table itself", () => {
    expect(equivalenceHeadingsSource).toMatch(/### Why each row is equivalent, not merely parallel/);
  });

  const criterionBullets = [
    "\\*\\*Initial judgment & strategy memo\\.\\*\\*",
    "\\*\\*Pre-meeting negotiation\\.\\*\\*",
    "\\*\\*Formal decision record\\.\\*\\*",
    "\\*\\*Individual decision autopsy\\.\\*\\*",
    "\\*\\*Partial rerun\\.\\*\\*",
  ];

  it.each(criterionBullets)("names a specific equivalence reason for: %s", (pattern) => {
    expect(labGuide).toMatch(new RegExp(pattern));
  });

  it("the pre-meeting negotiation reasoning names what's actually marked (fields), not whether contact was live", () => {
    expect(labGuide).toMatch(
      /not whether the contact happened inside a\s*\n\s*real-time group/i,
    );
  });

  it("the decision record reasoning distinguishes marking standard from matching someone else's draft", () => {
    expect(labGuide).toMatch(
      /the criterion asks whether the record\s*\n\s*meets the standard, not whether it agrees with someone else's draft/i,
    );
  });

  it("[negative example] a bare assertion of equivalence with no stated standard would not match", () => {
    const oldWording =
      "The three pathways are naturally equivalent in evidentiary strength, since each asks for the same five artefacts.";
    expect(oldWording).not.toMatch(/the criterion asks whether the record/i);
    expect(oldWording).not.toMatch(/not whether the contact happened inside a/i);
  });
});

describe("The assessment brief, Policies and Templates pages stay synchronized with the Lab guide's pathway design", () => {
  it("the assessment brief points to the Lab guide's per-criterion pathway breakdown instead of re-describing it", () => {
    expect(assessmentBrief).toMatch(/live, async make-up, and alternative \/\s*\nstructured-async pathways/i);
    expect(assessmentBrief).toMatch(/\[Alignment\s*\nLab\]\(\/alignment-lab\/\)/i);
  });

  it("Policies names the alternative / structured-async pathway for a student missing Week 9's session entirely", () => {
    expect(policies).toMatch(/alternative \/ structured-async pathway rather than the ordinary async\s*\nmake-up/i);
  });

  it("Templates' decision record entry states the same fields are used across all three pathways' versions", () => {
    expect(templatesPage).toMatch(
      /async make-up's corrected\/reconstructed\s*\nrecord and an alternative-pathway's independently-produced record are scored\s*\nagainst/i,
    );
  });

  it("[negative example] a Templates entry describing only the live group's record misses the other two pathways", () => {
    const oldWording = "The one document the Alignment Lab group produces together.";
    expect(oldWording).not.toMatch(/async make-up/i);
    expect(oldWording).not.toMatch(/alternative-pathway/i);
  });
});
