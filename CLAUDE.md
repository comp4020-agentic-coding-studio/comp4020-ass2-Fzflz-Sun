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

- The running case's people, numbers, dates and role cards should be treated
  as canonically defined in `src/data/case-facts.ts` and `src/data/
  alignment-lab.ts`; markdown content pages can't literally import a TS
  constant, so keeping them aligned is a manual discipline, not an automatic
  one. `spec/case-consistency.test.ts` checks a narrower slice
  mechanically: it greps rendered page text for the canonical vendor name
  and budget figure and fails on a conflicting one, and separately checks
  that `engagementSignalTimeline` itself runs in non-decreasing date order —
  it does not check people's names, most dates quoted in page prose, or that
  a page's prose actually matches the data file. Each check has a negative
  example proving it actually catches the drift it claims to catch; treat
  everything outside that narrow slice (most dates, all names, all
  cross-week narrative claims) as human-review territory until a test
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
- Automated checks protect only what's mechanically checkable (dates in
  order, weights summing to 100, required fields present, links resolving).
  Coherence, whether the fictional case is believable, ethical judgement,
  and distinctive voice are human-review items — say so plainly rather than
  writing a check that only pattern-matches for keywords.
