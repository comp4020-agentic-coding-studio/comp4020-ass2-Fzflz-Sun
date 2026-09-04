# Process overview — working evidence

<!-- TEMPLATE: These are agent-assisted evidence notes, not the student's final
     process narrative. Keep this draft marker until the student has replaced
     the notes with their own account and reviewed its citations. -->

> Snapshot: 3 September 2026 (AEST), against commit
> [7433cd3](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/7433cd39021bccb5f073d9a96b44df904613bd9e).
> The working tree was clean before this documentation edit. This is an
> evidence index, not a submission-ready personal account. Under [CLAUDE.md](CLAUDE.md)
> and the [assignment brief](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/assessments/assignment-2/),
> the final 400–600-word narrative must be written by the student.

## Design position to develop in the narrative

The design discussion moved from broad workplace unwritten rules to a narrower
question: how decisions form through invitations, agendas, private conversations
and records. The student questioned whether assigned roles would generate real
pressure or merely encourage superficial acting. The proposed response was to
model responsibilities, information, constraints and dependencies rather than
personalities. This discussion supplies motivation; the commits below establish
what was actually implemented, not whether students have successfully used it.

## Traceable implementation

[da715b6](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/da715b6fd9bbf384b150f501155600f72ffff55d)
introduced a general working harness: preview, inspect rendered pages, read
failures, and check before pushing. Its presence records intended practice; it
does not prove that every commit passed validation.

[5ade0a8](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/5ade0a806babdb5dc8b48505ae8c10e2374858a4)
added four mechanical requirements before the course implementation: retain the
allocated `700` suffix, provide weeks 1–12, link a non-starter deck, and total
assessment weights to 100%. The week-number assertion does not itself validate
dates; the inherited data-integrity test checks their presence and teaching-period
bounds.

[7433cd3](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/7433cd39021bccb5f073d9a96b44df904613bd9e)
implemented a representative slice of **SLOP4700, The Meeting Before the Meeting**:
the homepage, Week 3 session and lecture, a 13-slide agenda deck, three assessment
briefs, the Alignment Lab guide, a contact simulator and six downloadable templates.
It is not a completed twelve-week course.

That same commit translated the simulation design into four functional role
cards with six required fields. It separated the public hot-desking example from
the confidential assessed scenario and separated the Lab's 45% course weight
from its internal 20/20/15/35/10 breakdown. Only 15% of the Lab's internal mark is
shared; the rest concerns individual evidence. The guide rejects scoring by
negotiation victory and includes continuity and alternative-participation rules.

The course-specific harness and tests protect role-field completeness, scoring
metadata and a limited set of case facts. Negative examples exercise missing
fields, duplicate roles, altered weights and conflicting figures. These checks
do not establish pedagogical fairness, believable motivations or effective
student participation; those remain human-review questions.

## Student review supplied during this audit

The student provided this feedback after the repository inspection, not as part
of the earlier implementation commit:

> 目前的话，我感觉内容肯定还是不够的，只有到第三周的内容。不过整体网页的框架已经出来了，这个基本上不错，可以继续朝着这个方向深入

In substance, this accepts the current website framework and direction while
explicitly withholding acceptance of the course's content completeness. The
next priority is to deepen and extend the teaching material beyond the current
slice. This feedback does not claim a particular viewport, interaction test or
automated check was personally verified.

## Verification performed during this audit

These results were obtained by the agent on 3 September, after the implementation
commit; they are not evidence of earlier student testing.

- `pnpm check`: type checking reported **0 errors, 0 warnings and 0 hints**.
  The production build generated **22 pages**. It reported no broken internal
  links or deck-structure violations. Accessibility results reused cached checks
  for all 22 unchanged pages, rather than constituting a fresh visual review.
- The specification suite reported **21 passed, 1 failed**. The failure is
  `runs across twelve dated teaching weeks`: the built week set is `[1, 2, 3]`.
  The initial sandboxed run could not start Astro's local font service; an
  authorised rerun reached the build and specification results above.
- `pnpm check:evidence` failed on remaining starter content, four unchanged
  starter images and the unfinished process document. Its original fictitious
  example citations have now been replaced with real commits. The draft marker
  remains intentionally until the student's narrative is written.

## Limits to resolve before making stronger claims

*(This section is the original 3 September snapshot's list, kept as written.
Several items on it — Weeks 1–2's content, the role-data rendering gap, the
templates missing fields, and the case-consistency test's narrow scope — are
addressed in the "Round 4 working evidence" section below, added later the
same day. Policies, people entries and the starter images are not; see that
section's verification results for the current, unresolved list.)*

Weeks 1–2, policies, people entries and the Week 1 deck still contain starter
material; Weeks 4–12 are only an outline. Browser interaction, mobile readability,
real classroom use and deployment were not verified in this audit.

The single-source claim in `CLAUDE.md` is stronger than the implementation:
`spec/case-consistency.test.ts` scans only three Week 3 source files for vendor
mentions and formatted budget figures. It does not enforce imports or validate
all people, dates or rendered pages. The contact-limit test similarly reads
source defaults rather than exercising the browser. Record these as initial,
narrow safeguards, not complete consistency or usability guarantees.

The full role data is not all rendered as readable HTML, and several downloadable
templates omit fields required by the Lab guide. Fiction framing and reading
attribution also need review. These are remaining review findings, not fixes
performed by this documentation change.

## Round 4 working evidence (3 September 2026)

This section documents a further agent-assisted pass made after the snapshot
above, at the student's request, to make the existing site's weeks and
Alignment Lab materials cohere rather than to add new pages. This section was
written while the round's changes were still uncommitted against `559e3d9`;
they were committed later, together with Rounds 5 and 6, as
[de71113](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/de71113a11a7e91495b84ba11e0a4a3c1444eafb)
— see the Round 6 section below for that commit's full scope. Some items this
round reported as still-failing (see "Verification performed" below) were
fixed in a later round, not by this one.

**What changed:**

- Reworded the homepage, the Decision Autopsy brief and the Decision System
  Redesign brief so a well-argued "no seam" or "indeterminate" finding counts
  as a legitimate result, and so the redesign assessment's goal is stated as
  making decisions more challengeable and traceable — not eliminating
  pre-meeting conversation. This was a genuine rewrite of standing text, not
  an addition.
- Rewrote `src/components/ContactSimulator.astro`: removed the `factFor()`
  modulo-index function that silently skipped a role's `uniqueEvidence` on
  any contact after the first, replaced the hours-based countdown with a
  direct count against `MAX_SELF_INITIATED_CONTACTS`, added a view of the
  player's own role card, and added a judgment-change prompt after every
  contact.
- Added `src/components/RoleCardList.astro`, rendering all six fields of
  all four role cards, and used it on `/alignment-lab/` in place of the old
  three-column table that had rendered only half the fields while the prose
  beside it claimed "fully revealed."
- Expanded the `/alignment-lab/` worked example from an intro paragraph into
  seven named, filled artefacts: initial judgment, four role cards, a filled
  strategy memo, a negotiation log with more entries than self-initiated
  contacts, a decision record showing conditional dissent, four explicit
  if-then consequence rules applied to that record, and a retrospective with
  a partial rerun.
- Rewrote five of the six downloadable templates (all but the agenda) to
  add the fields the Lab guide and assessment briefs already promised —
  evidence relied on, unverified assumptions, action owner, final decision
  authority, conditions for reopening a decision record, and an open-ended
  negotiation log no longer hardcoded to exactly two contacts — and synced
  `src/pages/templates/index.mdx`'s embedded copies to match byte-for-byte.
- Added outline-level session pages for weeks 4–12
  (`src/content/sessions/04-*.md` through `12-*.md`). These are genuinely
  outline-depth, not full worked weeks, per the student's brief; each has a
  real `spec:`, a short before/in/after structure, and no dead links. Weeks
  9–11 tie the Alignment Lab's role-assignment, formal decision meeting and
  retrospective to specific sessions; week 12 ties to the redesign
  assessment.
- Added/extended spec tests: `spec/alignment-lab-scoring.test.ts` (contact
  count sourced from canonical data, the fixed `factFor` bug, the own-card
  and judgment-prompt additions), `spec/role-card-fields.test.ts` (a new
  block reading the *rendered* `dist/alignment-lab/index.html` for all six
  field labels per archetype — the check that would have caught the
  three-of-six-fields bug), `spec/case-consistency.test.ts` (extended to
  weeks 1–2's session/lecture/deck files), and a new
  `spec/templates-consistency.test.ts` (six describe blocks checking the
  downloadable templates against the templates page and against the
  assessment briefs and Lab guide they're meant to match). Every new block
  has at least one negative example.

**Verification performed:**

- `pnpm test` (`pnpm build && vitest run spec`): build produced **31 pages**
  (up from 22), reported no broken internal links, no accessibility
  violations, and both decks passing structural checks. The full spec suite
  reported **48 passed, 0 failed** across 6 test files — including the
  `runs across twelve dated teaching weeks` test, which failed before this
  round's session pages existed and passes now that sessions cover weeks
  1–12.
- `pnpm check` (typecheck): **0 errors, 0 warnings**, after removing one
  unused-import hint found in `spec/case-consistency.test.ts`.
- `pnpm check:evidence`: **still fails**, and every failure it reports is
  pre-existing and untouched by this round's work (confirmed via
  `git status` — none of the failing paths appear as modified). It fails on:
  the `PROCESS.md` draft-marker check (expected — the marker stays until the
  student's own narrative replaces it); `STARTER_CONTENT` markers still
  present in `src/content/people/idris-fenn.md`,
  `src/content/people/marisol-quaye.md` and `src/pages/policies/index.mdx`
  (these still contain literal "Replace this entry" placeholder body text
  under otherwise-real frontmatter); and four starter image files
  (`card.png`, `hero-home.avif`, both people avifs) whose hashes are
  unchanged. **None of these three items were in this round's requested
  scope** (which was explicitly about weeks 1–3, the Alignment Lab, and the
  templates/interactions, not personas, policies or visual assets) — they
  are reported here as a factual, currently-still-failing gate, not
  something this round silently deferred.
- Manual browser verification (desktop/mobile viewports, keyboard
  navigation, actually clicking through the slide decks) was **not**
  performed by the agent — no browser-automation tool is available in this
  session. `pnpm dev` was left running; a human still needs to look at the
  rendered pages, particularly the new `ContactSimulator` interaction and
  the two slide decks, before treating this as classroom-ready.

## Round 5 working evidence (3 September 2026)

This section documents a further agent-assisted pass made after the "Round 4"
section above, at the student's request, to take the site from "weeks 1–3
built out, weeks 4–12 outline-level" to all twelve weeks complete, and to
close out the remaining `pnpm check:evidence` gaps that Round 4 explicitly
left open. This section was written while the round's changes were still
uncommitted against `559e3d9`; they were committed later, together with
Rounds 4 and 6, as
[de71113](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/de71113a11a7e91495b84ba11e0a4a3c1444eafb)
— see the Round 6 section below for that commit's full scope.

**What changed:**

- Wrote full lecture pages for weeks 4–12 (`src/content/lectures/week-04.md`
  through `week-12.md`) and upgraded the week 4–12 session pages from the
  outline stubs Round 4 added to full worked pages (`outline: true` removed
  from all nine, each with the running Engagement Signal Pilot case
  progressed a step further and a real in-class exercise, not a summary of
  one).
- Deleted the developer-facing notes Round 4 had left on the four
  student-visible hub pages (`src/pages/assessments/index.mdx`,
  `src/pages/lectures/index.mdx`, `src/pages/sessions/index.astro`,
  `src/pages/policies/index.mdx`), replacing them with prose a student would
  actually read.
- Fixed the last of five confirmed bugs in the `/alignment-lab/` worked
  example: the retrospective's partial rerun argued through a hypothetical
  in an unlabelled paragraph instead of stating it as the format the rerun
  itself expects — one named changed variable, what's held constant, the
  resulting difference, and the one assumption still doing unverified work.
  Rewrote it as an explicitly labelled block.
- Fixed a real race condition in `src/components/ContactSimulator.astro`:
  the old `updateCount()` both updated the disabled state of the contact
  buttons and decided whether to show the final verdict, so a second
  contact could be started before the first one's judgment prompt was
  resolved, silently overwriting `pendingTarget` and losing a judgment
  record. Added a `judgmentPending` flag that gates the buttons and splits
  the verdict decision into its own `showVerdictIfDone()`, so a second
  contact cannot start until the first one's judgment is recorded.
- Fixed the homepage's week table (`src/pages/index.astro`): it previously
  claimed "Weeks 4–12 are outline-level" with no per-week links. It now
  links every week's title to its real session page and appends a link to
  the paired lecture, and the note beneath the table describes the actual
  completed twelve-week structure instead of the stale in-progress one.
- Extended `spec/case-consistency.test.ts`'s `casePages` array from 8 entries
  (weeks 1–3 only) to all 27 session/lecture/deck/alignment-lab pages across
  the twelve weeks. Running the extended check surfaced two real staleness
  bugs it was specifically built to catch: `src/content/lectures/week-09.md`
  named "the vendor relationship" generically instead of naming ClarityPulse
  (fixed by naming it), and `src/content/lectures/week-07.md` and
  `week-08.md` both still pointed their `related:` list at
  `assessments/decision-autopsy`, an assessment already due by the end of
  week 6 — fixed by pointing both at the upcoming `assessments/alignment-lab`
  instead.
- Added `spec/twelve-week-coverage.test.ts`: checks every week 1–12 has
  exactly one session and one lecture, neither carries a leftover `outline`
  marker, each pair links to the other, teaching alternates
  marisol-quaye/idris-fenn on the odd/even pattern the two people bios
  describe, and dates run one Monday per week in order — plus a check that
  the four student-facing hub pages carry none of the developer-facing
  markers removed above. Every block has a negative example.
- Added `spec/alignment-lab-phasing.test.ts`: guards specifically against the
  schedule contradiction an earlier draft had (Week 9 implying the group
  waits for "the formal decision meeting in Week 10") by asserting Week 9
  states its contact window and decision meeting both happen within Week 9
  itself, Week 10 is framed as a reveal and consequence test against a
  record that already exists rather than a first-time negotiation, and the
  Alignment Lab assessment's due date matches Week 11's own session date
  exactly (not before or after it). Also has negative examples.
- Closed the three items Round 4's verification explicitly left failing:
  removed the `photo`/`photoAlt` frontmatter and prose placeholders from
  both people entries and from `src/pages/policies/index.mdx` (already done
  earlier this round, see above), and deleted the four starter image files
  whose hashes `check:evidence` was still flagging as unreplaced
  (`src/assets/images/card.png`, `hero-home.avif`, and both people avifs),
  removing their now-dangling `heroImage`/`socialImage`/`photo` references
  from `src/pages/index.astro`, `src/pages/404.md`, `src/site-config.ts` and
  both people files. This is a deliberate image-free treatment, not a
  placeholder — the theme's `heroImage`/`socialImage`/`photo` props are all
  optional, confirmed by reading the theme source directly, and
  `check-evidence.ts`'s own comment names "image-free treatment" as an
  accepted outcome of this check rather than requiring a replacement image.
  No fabricated photorealistic portraits were made to stand in for the
  fictional staff, consistent with the course's own design principle
  against faking real-looking people for a fictional case.

**Verification performed:**

- `pnpm test` (`pnpm build && vitest run spec`): build produced **40 pages**
  (up from 31 at the end of Round 4), reported no broken internal links, no
  accessibility violations, and both decks passing structural checks. The
  full spec suite reported **72 passed, 0 failed** across 8 test files.
- `pnpm check` (typecheck + test): **0 errors, 0 warnings**.
- `pnpm check:evidence`: still fails, but now on exactly one item —
  `PROCESS.md`'s draft-marker check, which is expected and intentional: the
  marker stays until the student's own narrative replaces it, per
  `CLAUDE.md`'s rule that this file's closing narrative is student-authored.
  The `STARTER_CONTENT` scan (`git grep -n -F STARTER_CONTENT -- src`)
  returns no matches, and all four starter-image hash checks now pass
  because the files are deleted rather than unchanged. Every item Round 4's
  verification listed as still-failing is now resolved.
- Manual browser verification (desktop/mobile viewports, keyboard
  navigation, clicking through the updated `ContactSimulator`) was **not**
  performed by the agent this round either — no browser-automation tool is
  available in this session, the same limitation Round 4 documented. `pnpm
  dev` was left running; a human still needs to look at the rendered pages —
  particularly the fixed `ContactSimulator` judgment sequencing, the new
  week 4–12 lecture and session pages, and the homepage's week table — before
  treating any of this as classroom-ready.

## Round 6 working evidence (4 September 2026)

This section documents a further agent-assisted pass made after the "Round 5"
section above, at the student's request, to fix a specific list of
correctness and consistency problems across the already-complete twelve-week
site — not to add new pages or change the platform, theme, or assessment
weights. Everything below, and everything in the Round 4 and Round 5 sections
above (which were still uncommitted when written), was committed together as
[de71113](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-Fzflz-Sun/commit/de71113a11a7e91495b84ba11e0a4a3c1444eafb)
and pushed to `origin/main` at the student's explicit request. That single
commit is large — it bundles three separate working sessions' worth of
change (Rounds 4, 5 and 6) because none of them had been committed
individually as the work happened. Read the diff at that commit for what
actually changed; do not assume a description below is proof of a matching,
separately-reviewable commit.

**What changed:**

- Rewrote `src/components/ContactSimulator.astro`'s state machine and added
  `spec/contact-sim-state.test.ts` (14 tests, one a negative example) to
  behaviourally verify it: a second contact cannot start while a judgment is
  pending; resolving a judgment with nothing pending, or resolving the same
  judgment twice, is a no-op rather than a duplicate log entry; the
  simulation is only "done" once max contacts is reached **and** the last
  judgment is resolved (not either alone); restarting fully clears contacts,
  the pending judgment and the log. The previous test coverage
  (`spec/alignment-lab-scoring.test.ts`) only checked the component's source
  text, not its actual runtime behaviour — that file is left in place, and
  the new one is additive.
- Unified the Alignment Lab's Week 9–11 schedule, which previously
  contradicted itself across the session pages, lecture pages and Policies:
  role assignment and the pre-meeting contact window both open in Week 9's
  session; the decision meeting itself is self-arranged by the group within
  the 48–72 hour window afterwards, not held inside a scheduled class; Week
  10's session is a reveal and consequence test against a record that
  already exists; the Lab's entire graded submission — including the
  individual autopsy and partial rerun — is due before Week 11's session
  runs, and the "partial rerun" activity that happens live in Week 11's
  session is now explicitly labelled a separate, supplementary, ungraded
  group discussion, not a second instance of the graded item. Edited
  `src/content/sessions/11-the-ethics-of-alignment.md`,
  `src/content/lectures/week-10.md`, `src/content/lectures/week-11.md` and
  `src/pages/policies/index.mdx` (which also gained an explicit carve-out
  distinguishing the Lab's own required pre-meeting contact — expected,
  self-initiated, evidenced — from the collaboration-ban's actual target:
  scripting the meeting in advance or ghost-writing another role's lines).
  No scored component was removed or reweighted; only sequencing and wording
  changed. `src/content/sessions/09-who-actually-decides.md` and
  `src/content/sessions/10-minutes-make-memory.md` were read and confirmed
  already consistent with this arrangement, not edited.
- Cross-checked the running case's own material against what the lectures
  and sessions claim about it, and fixed four confirmed fabrications/
  overreaches:
  - `src/content/sessions/04-the-meeting-before-the-meeting.md` and
    `src/content/lectures/week-04.md` called the 13 March 2027 meeting
    "Thursday's" meeting; 13 March 2027 is actually a Saturday (checked with
    Python's `datetime`). Fixed the weekday label rather than the
    well-established, cross-referenced date itself.
  - `src/content/lectures/week-07.md` and
    `src/content/sessions/07-power-in-the-room.md` claimed the chair
    "responds to the second suggestion by name" — the transcript quoted on
    the session page itself never names Castellano; the chair only folds
    her suggestion into the plan without addressing her by name. Reworded
    both files to state what the transcript actually shows: accepted but
    unnamed, not accepted and credited. The same lecture also said "five
    more agenda items" where the transcript says "four more items" — fixed
    to match.
  - `src/content/lectures/week-08.md` and
    `src/content/sessions/08-dissent-without-disappearing.md` drew
    absolute "not mentioned at all" / "disappears completely" conclusions
    about the complete Week 6 minutes document, when Week 6's own material
    is explicitly labelled an **excerpt**. Qualified every such claim to be
    about the excerpt shown, with an honest acknowledgement that the full
    document's content there is genuinely unknown either way — confirmed by
    re-reading `src/content/lectures/week-06.md`, which already scoped its
    own claims correctly and needed no change.
- Fixed the Alignment Lab's public consequence-rules worked example
  (`src/pages/alignment-lab/index.mdx`, "Consequences, from stated rules"),
  which previously claimed its rules were "mutually exclusive by
  construction" — false, since a record can trigger more than one at once.
  Replaced it with an explicit priority order (named-authority check, then
  cost-completeness, then a per-role minimum-outcome check applied
  independently to all four roles) and a genuine item-by-item walkthrough
  against the actual worked-example decision record and each role's real
  `minimumAcceptableOutcome` text from `src/data/case-facts.ts`, including
  an honest "cannot be determined from this record" result for the
  Executive Sponsor rather than a guessed one.
- In that same worked example: rewrote the Staff Representative's strategy
  memo so it no longer cites facts (the Delivery Lead's specific software
  concerns) she could not have known before making contact, and rewrote the
  retrospective and partial-rerun sections so the "this is basically free"
  framing is explicitly named and criticised as an overstatement by the
  fictional character's own retrospective — only the software licence was
  confirmed free, the fit-out was never costed — rather than being presented
  as an uncomplicated success.
- Fixed `src/lib/dates.ts`: `formatCourseDate` discarded the time-of-day and
  real UTC offset in a `due:` value (formatting `2027-05-03T12:00:00+10:00`
  as a bare date), so an assessment's actual deadline time was never shown.
  Added `formatCourseDeadline`, formatting with the course's actual
  configured timezone (`Australia/Canberra`, read from the `courseGraph`
  integration in `astro.config.ts`, not assumed), and rewired
  `src/components/AssessmentsGrid.astro` and
  `src/pages/assessments/[slug].astro` to use it. Confirmed in the built
  output that deadlines now render as, for example, "3 May 2027 at 12:00 pm
  AEST" and "29 March 2027 at 1:00 pm AEDT" — the AEST/AEDT difference
  between two dates six weeks apart confirms the timezone conversion is
  real, not a hardcoded label.
- Made one further-reading citation genuinely clickable rather than plain
  text: Sherry Arnstein's "A Ladder of Citizen Participation" (1969) in
  `src/content/sessions/02-first-review.md` now links to its real DOI
  (`https://doi.org/10.1080/01944366908977225`), which was checked against a
  live web search before adding, not assumed. Did not add citations to
  Session 1's deliberately generic further-reading pointer ("any research-
  methods... guide"), since a specific source there would have to be
  invented rather than verified.
- Fixed two real blind spots in `spec/twelve-week-coverage.test.ts`: its
  `byWeek()` helper built a `Map` keyed by week number, which would silently
  keep only the last of two sessions/lectures sharing a week number rather
  than fail; added an explicit duplicate-week check reading the raw list
  before deduplication. Its lecture-links-to-a-session check used
  `id.startsWith("sessions/")`, which would pass even if a lecture linked to
  the *wrong* week's session; changed it to require the exact session id for
  that week. Both have new negative examples.
- Extended `spec/case-consistency.test.ts` to check
  `engagementSignalTimeline` (`src/data/case-facts.ts`) itself runs in
  non-decreasing date order among its "fact"-kind entries — previously the
  file checked only the vendor name and budget figure, with no date or
  timeline check at all. (The one "inference"-kind entry, whose date range
  legitimately overlaps the fact before it by narrative design, is excluded
  from the ordering check rather than mis-flagged.)
- Corrected `CLAUDE.md`'s own claim about test coverage: it previously
  stated that pages "import the constant" from `case-facts.ts` (literally
  false — markdown content pages cannot import a TypeScript module) and
  implied `case-consistency.test.ts` checks people and dates broadly. Now
  states plainly what that test actually checks (vendor name, budget figure,
  and — after this round — timeline ordering) and names what remains
  unchecked (most dates in page prose, all names, all cross-week narrative
  claims) as human-review territory.

**Verification performed:**

- `pnpm check` (typecheck + `pnpm build && vitest run spec`): **0 errors, 0
  warnings** on typecheck; build produced **40 pages**, reported no broken
  internal links, no accessibility violations, and both decks passing
  structural checks. The full spec suite reported **92 passed, 0 failed**
  across 9 test files (up from 72 passed / 8 files at the end of Round 5:
  +14 from the new `spec/contact-sim-state.test.ts`, +4 from the
  `twelve-week-coverage` duplicate/exact-link checks and their negative
  examples, +2 from the `case-consistency` timeline-ordering check and its
  negative example).
- `pnpm check:evidence`: still fails on exactly the same single item Round 5
  left failing — the `PROCESS.md` draft-marker check — which remains
  expected and intentional until the student's own narrative replaces this
  evidence index.
- Read the built HTML output directly (`dist/assessments/index.html`,
  `dist/assessments/alignment-lab/index.html`) to confirm the deadline-format
  fix actually renders full date/time/timezone rather than trusting the
  source change alone.
- Manual browser verification (desktop/mobile viewports, keyboard
  navigation, actually clicking through the `ContactSimulator` and reading
  the reworded pages as a student would) was **not** performed by the agent
  this round either — no browser-automation tool is available in this
  session, the same limitation Rounds 4 and 5 documented. `pnpm dev` was
  left available; a human still needs to look at the rendered pages —
  particularly `/alignment-lab/`, the Week 4/7/8 lecture and session pages,
  the Week 9–11 sequence, and `/policies/` — before treating any of this as
  classroom-ready. The nine ContactSimulator behavioural requirements this
  round targeted are covered by `spec/contact-sim-state.test.ts` at the
  state-machine level; genuinely browser-only behaviours (actual keyboard
  focus order, actual `localStorage` persistence across a real reload) are
  not exercised by that test and were not separately verified in a browser
  this round — say so plainly rather than claiming coverage a unit test
  cannot provide.

## Student-authored account still needed

Use the evidence above to write one connected narrative, rather than submitting
this checklist. In particular:

- Explain why practical, constrained decision-making was preferable to a broad
  workplace-advice course or a performance-based role play.
- Identify which harness rules were personally accepted and why; distinguish
  structural guarantees from judgements deliberately left to human review.
- Describe what was actually inspected, rejected or changed, with the relevant
  commit and genuine before/after evidence. Do not infer personal verification
  from the existence of a test or from an agent's report.

Retain the useful commit links, update the status after further work, and remove
the draft marker only when the final account is genuinely the student's own.
