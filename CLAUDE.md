# COMP4020 prototype

The platform under you is fixed and documented in `README.md`, and the
[course website](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/)
publishes this deliverable's brief and spec. Read both before you plan or
build.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Run `pnpm check` before you push.
- Open the page in a browser and look at it. The rendered page is the truth;
  your mental model of it isn't.
- When a check fails, read its output before you change anything.
- Never commit a red state.

## Course-specific design rules ("The Meeting Before the Meeting")

- The running case's people, numbers, dates and role cards are canonically
  defined in `src/data/case-facts.ts` and `src/data/alignment-lab.ts`;
  markdown pages can't import a TS constant, so keeping them aligned is a
  manual discipline, not an automatic one. `spec/case-consistency.test.ts`
  checks more than the vendor name, budget figure and timeline ordering it
  started with: it now also holds the 2021-01-18 Finance & Risk memo to a
  narrow, load-bearing claim (records the figure, carries a signature)
  rather than letting it drift back into "signs off the budget", and pins
  Week 3's "real agenda item" to the student's own exercise, not the
  fictional case — reading the source Markdown/MDX and `case-facts.ts`
  directly, each with a negative example proving the check catches the old
  wording. `spec/pathway-rubric-consistency.test.ts` and
  `spec/consequence-rules.test.ts` protect similarly specific,
  previously-drifted claims (the decision record's pathway-qualified
  wording; a role card's prose constraint agreeing with its typed
  `constraintMet` input and the Lab page's computed-outcome justification).
  These are targeted fixes for claims that actually drifted once, not a
  general guarantee that every name, date or cross-week narrative statement
  stays in sync — most prose is still human-review territory until a test
  exists for it.
- The Alignment Lab has two separate weight systems that must never be
  conflated: its 45% weight in the whole-course total (`weight:` on
  `assessments/alignment-lab.md`), and its own internal 100%, five-part
  breakdown (`marking.criteria` on that same file, canonicalised in
  `src/data/alignment-lab.ts`). Changing one is not changing the other.
- Public role cards and case materials on the site are always the
  post-reveal or worked-example version, explicitly labelled as such. The
  real Lab scenario is confidential and distributed by teaching staff — never
  fake that secrecy with front-end hiding on a public static site.
- Case documents and role cards get their "this is teaching fiction, not a
  real record" framing from the surrounding prose on the page they're
  introduced on; don't invent a real institution, real employee, or real
  incident to stand in for one.
- `PROCESS.md`'s closing first-person narrative is written by the student,
  not generated. An agent may supply an evidence index and check commit
  citations resolve, but never fabricates the narrative's experience,
  trade-offs, or commits.
- Automated checks fall into three tiers; conflating them is the mistake to
  avoid:
  - **Structural invariants**, enforced by the build and `spec/` without
    reading any prose: dates in order and inside the teaching period, all
    twelve weeks present, assessment weights summing to 100%, required
    role-card fields present, links resolving.
  - **Selected semantic invariants**: a small set of specific prose claims
    (see above) that drifted once, were deliberately corrected, and are now
    pinned with source-level tests and negative examples. This is not a
    general verification that all content is internally consistent — it's
    coverage for the particular claims that mattered enough to fix and test.
  - **Human judgement**: overall twelve-week coherence, whether the role
    constraints create believable pressure, whether the alternative
    pathways are ethically fair, and whether the writing has a distinctive
    voice. No check exists for these, and none should — say so plainly
    rather than writing a check that only pattern-matches keywords.
