import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The ten templates exist in two places: the downloadable file under
// public/templates/, and a copy embedded in a code fence on
// src/pages/templates/index.mdx. Nothing keeps these in sync automatically,
// so this file checks both that they agree with each other and that each one
// actually contains the fields the rest of the site promises it will.

const TEMPLATE_NAMES = [
  "agenda",
  "continuity-memo",
  "decision-autopsy",
  "decision-record",
  "initial-judgment",
  "lab-decision-autopsy",
  "negotiation-log",
  "partial-rerun",
  "redesign",
  "strategy-memo",
] as const;

const readTemplate = (name: (typeof TEMPLATE_NAMES)[number]) =>
  readFileSync(resolve(`public/templates/${name}.txt`), "utf8").trim();

const templatesPage = readFileSync(resolve("src/pages/templates/index.mdx"), "utf8");

function extractCodeFences(text: string): string[] {
  const fences: string[] = [];
  const regex = /```text\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    fences.push(match[1].trim());
  }
  return fences;
}

describe("Downloadable templates match the copies embedded on the templates page", () => {
  const fences = extractCodeFences(templatesPage);

  it("finds one code fence per template on the page", () => {
    expect(fences.length).toBe(TEMPLATE_NAMES.length);
  });

  it("every downloadable .txt file is byte-identical (modulo trailing whitespace) to its embedded fence", () => {
    for (const name of TEMPLATE_NAMES) {
      const file = readTemplate(name);
      const matchingFence = fences.find((fence) => fence.startsWith(file.slice(0, 20)));
      expect(matchingFence, `no embedded fence on the templates page starts like ${name}.txt`).toBeDefined();
      expect(matchingFence).toBe(file);
    }
  });

  it("[negative example] a page fence edited out of sync with its .txt file is caught", () => {
    const file = readTemplate("agenda");
    const driftedFence = `${file}\nAn extra line only on the page.`;
    expect(driftedFence).not.toBe(file);
  });
});

describe("Decision record template covers the fields the Lab guide promises", () => {
  const decisionRecord = readTemplate("decision-record");

  it("includes evidence relied on, distinct from an unverified assumption", () => {
    expect(decisionRecord).toMatch(/evidence relied on/i);
    expect(decisionRecord).toMatch(/unverified assumption/i);
  });

  it("includes an action owner, distinct from who signs off", () => {
    expect(decisionRecord).toMatch(/action owner/i);
  });

  it("includes a final decision authority, distinct from who agreed or dissented", () => {
    expect(decisionRecord).toMatch(/final decision authority/i);
  });

  it("includes conditions for reopening the record", () => {
    expect(decisionRecord).toMatch(/reopen/i);
  });

  it("[negative example] the old five-field version is missing at least one of these", () => {
    const old = [
      "The decision:",
      "Who agreed:",
      "Who dissented, and on what grounds:",
      "What information arrived too late to change the outcome, if any:",
      "Who signs off on this record:",
    ].join("\n");
    expect(old).not.toMatch(/action owner/i);
    expect(old).not.toMatch(/final decision authority/i);
    expect(old).not.toMatch(/reopen/i);
  });
});

describe("Negotiation log template does not cap the log at exactly two entries", () => {
  const negotiationLog = readTemplate("negotiation-log");

  it("does not hardcode 'Contact 1' / 'Contact 2' as the only two slots", () => {
    expect(negotiationLog).not.toMatch(/contact 1:/i);
    expect(negotiationLog).not.toMatch(/contact 2:/i);
  });

  it("names the two-self-initiated-contact cap without capping the log itself", () => {
    expect(negotiationLog).toMatch(/at most two self-initiated contacts/i);
    expect(negotiationLog).toMatch(/repl(y|ies)/i);
  });

  it("carries purpose, new information, commitments and judgment-change fields", () => {
    expect(negotiationLog).toMatch(/purpose/i);
    expect(negotiationLog).toMatch(/new information/i);
    expect(negotiationLog).toMatch(/commitment/i);
    expect(negotiationLog).toMatch(/judgment change/i);
  });

  it("[negative example] the old template is caught by the 'Contact 1' check", () => {
    const old = "NEGOTIATION LOG — [your role]\n\nContact 1: [who]\nContact 2: [who]";
    expect(old).toMatch(/contact 1:/i);
  });
});

describe("Strategy memo template matches what the Lab guide says a memo contains", () => {
  const strategyMemo = readTemplate("strategy-memo");
  const labProcessSource = readFileSync(resolve("src/data/alignment-lab.ts"), "utf8");

  it("the guide's step-2 description and the template name the same five things", () => {
    expect(labProcessSource).toMatch(/their responsibilities/i);
    expect(strategyMemo).toMatch(/my responsibilities/i);
    expect(strategyMemo).toMatch(/my evidence/i);
    expect(strategyMemo).toMatch(/what i don't know/i);
    expect(strategyMemo).toMatch(/who i plan to contact/i);
    expect(strategyMemo).toMatch(/ethical boundaries/i);
  });

  it("[negative example] a memo about concessions rather than evidence would not match", () => {
    const old = "What I want:\nWhat I can concede:\nWho I expect to oppose me:";
    expect(old).not.toMatch(/my evidence/i);
    expect(old).not.toMatch(/ethical boundaries/i);
  });
});

describe("Decision autopsy template allows all three seam conclusions the assessment brief allows", () => {
  const decisionAutopsy = readTemplate("decision-autopsy");
  const assessmentBrief = readFileSync(
    resolve("src/content/assessments/decision-autopsy.md"),
    "utf8",
  );

  it("the template's 'seam' field and the assessment brief both name all three conclusions", () => {
    expect(assessmentBrief).toMatch(/seam, or why there isn't one/i);
    expect(decisionAutopsy).toMatch(/seam, or why there isn't one/i);
    // (a) a seam, (b) a genuinely open process, (c) indeterminate — the same
    // three-way split the assessment brief itself argues for, not the looser
    // two-option "genuinely open or indeterminate" phrasing an earlier draft
    // of this template used.
    expect(assessmentBrief).toMatch(/a genuinely open process/i);
    expect(decisionAutopsy).toMatch(/a genuinely open process/i);
    expect(assessmentBrief).toMatch(/indeterminate/i);
    expect(decisionAutopsy).toMatch(/\(c\) indeterminate/i);
  });

  it("indeterminate is not a bare fallback: it requires missing evidence, an alternative, and what would change the judgement", () => {
    expect(decisionAutopsy).toMatch(/alternative explanation you could not rule out/i);
    expect(decisionAutopsy).toMatch(/what would change your judgement/i);
  });

  it("[negative example] a template that only asks for a seam disagrees with the brief", () => {
    const old = "The seam (where the outcome looks settled before the forum that announced it):";
    expect(old).not.toMatch(/or why there isn't one/i);
  });

  it("[negative example] the old two-option 'genuinely open or indeterminate' phrasing no longer appears", () => {
    // Regression guard: an earlier draft of this template collapsed (b) and
    // (c) into one loose phrase instead of two distinct, separately-argued
    // conclusions. If that phrasing ever comes back, it has lost the
    // three-way structure this test otherwise checks for.
    expect(decisionAutopsy).not.toMatch(/genuinely open or indeterminate/i);
  });
});

describe("Initial judgment template records a position before role assignment", () => {
  const initialJudgment = readTemplate("initial-judgment");

  it("asks what should happen based only on public materials, before a role exists", () => {
    expect(initialJudgment).toMatch(/public materials/i);
    expect(initialJudgment).toMatch(/before any role/i);
  });

  it("[negative example] a template with no reference to timing would not match", () => {
    const old = "What I think should happen:\nWhy:";
    expect(old).not.toMatch(/before any role/i);
  });
});

describe("Continuity memo template covers what the Lab guide's ground rules promise it does", () => {
  const continuityMemo = readTemplate("continuity-memo");
  const labGuide = readFileSync(resolve("src/pages/alignment-lab/index.mdx"), "utf8");

  it("the guide's ground rules and the template both describe keeping this updated for absence", () => {
    expect(labGuide).toMatch(/continuity memo/i);
    expect(continuityMemo).toMatch(/current position/i);
    expect(continuityMemo).toMatch(/commitments made or received/i);
    expect(continuityMemo).toMatch(/if i am absent/i);
  });

  it("[negative example] a memo with no absence-handoff field would not match", () => {
    const old = "CONTINUITY MEMO\n\nMy position:\nWhat I know:";
    expect(old).not.toMatch(/if i am absent/i);
  });
});

describe("Alignment Lab individual autopsy template is distinct from the standalone Decision Autopsy template", () => {
  const labAutopsy = readTemplate("lab-decision-autopsy");
  const decisionAutopsy = readTemplate("decision-autopsy");
  const assessmentBrief = readFileSync(
    resolve("src/content/assessments/alignment-lab.md"),
    "utf8",
  );

  it("allows arguing the process held up with no significant distortion, not just naming one", () => {
    expect(labAutopsy).toMatch(/no significant distortion/i);
  });

  it("is not the same document as the standalone decision autopsy template", () => {
    expect(labAutopsy).not.toBe(decisionAutopsy);
    expect(labAutopsy).toMatch(/group's decision record/i);
    expect(decisionAutopsy).not.toMatch(/group's decision record/i);
  });

  it("allows all three conclusions — distortion, no significant distortion, indeterminate — same as the standalone template", () => {
    expect(labAutopsy).toMatch(/\(a\) a specific distortion/i);
    expect(labAutopsy).toMatch(/\(b\) the process held up/i);
    expect(labAutopsy).toMatch(/\(c\) indeterminate/i);
  });

  it("indeterminate is not a bare fallback here either: missing evidence, an alternative, and what would change the judgement", () => {
    expect(labAutopsy).toMatch(/alternative explanation you could not rule out/i);
    expect(labAutopsy).toMatch(/what would change your judgement/i);
  });

  it("the assessment brief's spec names all three conclusions, matching the template", () => {
    expect(assessmentBrief).toMatch(/naming a specific distortion/i);
    expect(assessmentBrief).toMatch(/no significant distortion/i);
    expect(assessmentBrief).toMatch(/indeterminate on what you have/i);
  });

  it("[negative example] a template that only allows naming a distortion would not match", () => {
    const old = "What actually decided the outcome, and the distortion that caused it:";
    expect(old).not.toMatch(/no significant distortion/i);
    expect(old).not.toMatch(/\(c\) indeterminate/i);
  });

  it("[negative example] a brief spec that only names two conclusions is caught", () => {
    const oldSpec =
      "reaching an evidenced conclusion about what shaped the outcome — naming a " +
      "specific distortion where the record supports one, or arguing that the " +
      "process held up and no significant distortion is evident";
    expect(oldSpec).not.toMatch(/indeterminate on what you have/i);
  });
});

describe("Partial rerun template names a changed variable, held constants, and a remaining assumption", () => {
  const partialRerun = readTemplate("partial-rerun");

  it("carries all four fields the worked example and assessment spec describe", () => {
    expect(partialRerun).toMatch(/changed variable/i);
    expect(partialRerun).toMatch(/held constant/i);
    expect(partialRerun).toMatch(/resulting difference/i);
    expect(partialRerun).toMatch(/unverified assumption/i);
  });

  it("[negative example] a vague 'what might have happened' template would not match", () => {
    const old = "What might have gone differently:\nWhy:";
    expect(old).not.toMatch(/changed variable/i);
    expect(old).not.toMatch(/held constant/i);
  });
});

describe("Redesign template tests the replacement against a scenario, matching its assessment brief", () => {
  const redesign = readTemplate("redesign");
  const assessmentBrief = readFileSync(
    resolve("src/content/assessments/decision-system-redesign.md"),
    "utf8",
  );

  it("both the brief and the template require testing against a concrete scenario", () => {
    expect(assessmentBrief).toMatch(/at least one concrete scenario/i);
    expect(redesign).toMatch(/concrete scenario/i);
  });

  it("both name that eliminating pre-meeting coordination is not the goal", () => {
    expect(assessmentBrief).toMatch(/not\s+.*eliminat/i);
    expect(redesign).toMatch(/pre-meeting\s+coordination/i);
  });

  it("[negative example] the old four-line template has no scenario field", () => {
    const old = [
      "Who currently decides, and how:",
      "What is wrong with it today, with evidence:",
      "The replacement: who is invited, when, on what information, with what record:",
      "Who loses influence under the new design:",
    ].join("\n");
    expect(old).not.toMatch(/concrete scenario/i);
  });
});
