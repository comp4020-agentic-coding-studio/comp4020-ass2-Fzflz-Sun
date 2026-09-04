import { describe, expect, it } from "vitest";
import {
  attemptContact,
  canContactTarget,
  initialState,
  isDone,
  playRole,
  resolveJudgment,
  untouchedArchetypes,
  type ContactSimState,
} from "../src/lib/contact-sim";

// Real behavioural regression tests for the Alignment Lab's contact-window
// demo, driven directly against the pure state machine in
// src/lib/contact-sim.ts rather than by grepping ContactSimulator.astro's
// source for variable or function names. Each test corresponds to one of the
// nine behaviours the reproduced bug report required: before picking a role
// the judgment area must never be reachable, an unresolved judgment must
// block a second contact, judgments must be recorded exactly once and
// correctly attributed, "done" must require both the contact count AND the
// last judgment to be resolved, and a restart must fully clear state.

const MAX = 2;
const A = "Executive Sponsor";
const B = "Delivery Lead";
const C = "Staff Representative";

describe("contact-sim state machine", () => {
  it("starts with no pending judgment and no contacts — the judgment area has nothing to show", () => {
    const state = initialState();
    expect(state.judgmentPending).toBe(false);
    expect(state.contacted).toEqual([]);
    expect(state.pendingTarget).toBeNull();
  });

  it("picking a role does not by itself open a judgment", () => {
    const state = playRole(A);
    expect(state.judgmentPending).toBe(false);
    expect(state.pendingTarget).toBeNull();
  });

  it("a successful contact opens a judgment naming that specific target", () => {
    const afterRole = playRole(A);
    const attempt = attemptContact(afterRole, B, MAX);
    expect(attempt.ok).toBe(true);
    if (!attempt.ok) return;
    expect(attempt.state.judgmentPending).toBe(true);
    expect(attempt.state.pendingTarget).toBe(B);
  });

  it("a second contact cannot start while the first contact's judgment is unresolved", () => {
    const afterRole = playRole(A);
    const first = attemptContact(afterRole, B, MAX);
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = attemptContact(first.state, C, MAX);
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.reason).toBe("judgment-pending");
  });

  it("resolving a judgment records exactly one log entry, attributed to the contacted target", () => {
    const afterRole = playRole(A);
    const contacted = attemptContact(afterRole, B, MAX);
    expect(contacted.ok).toBe(true);
    if (!contacted.ok) return;

    const resolved = resolveJudgment(contacted.state, true);
    expect(resolved.ok).toBe(true);
    if (!resolved.ok) return;
    expect(resolved.target).toBe(B);
    expect(resolved.state.judgmentLog).toEqual([{ target: B, changed: true }]);
    expect(resolved.state.judgmentPending).toBe(false);
    expect(resolved.state.pendingTarget).toBeNull();
  });

  it("resolving a judgment with nothing pending is a no-op: no log entry, no state change", () => {
    const state = playRole(A);
    const resolution = resolveJudgment(state, true);
    expect(resolution.ok).toBe(false);
  });

  it("resolving the same judgment twice only ever logs it once", () => {
    const afterRole = playRole(A);
    const contacted = attemptContact(afterRole, B, MAX);
    expect(contacted.ok).toBe(true);
    if (!contacted.ok) return;

    const firstResolve = resolveJudgment(contacted.state, false);
    expect(firstResolve.ok).toBe(true);
    if (!firstResolve.ok) return;

    const secondResolve = resolveJudgment(firstResolve.state, false);
    expect(secondResolve.ok).toBe(false);
    expect(firstResolve.state.judgmentLog).toHaveLength(1);
  });

  it("is not done once max contacts is reached while the last judgment is still pending", () => {
    let state: ContactSimState = playRole(A);
    const first = attemptContact(state, B, MAX);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const firstResolved = resolveJudgment(first.state, false);
    expect(firstResolved.ok).toBe(true);
    if (!firstResolved.ok) return;
    state = firstResolved.state;

    const second = attemptContact(state, C, MAX);
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    state = second.state;

    // Contact count is at MAX, but the second judgment has not been resolved yet.
    expect(state.contacted.length).toBe(MAX);
    expect(isDone(state, MAX)).toBe(false);
  });

  it("is done only once max contacts is reached AND the last judgment is resolved", () => {
    let state: ContactSimState = playRole(A);
    const first = attemptContact(state, B, MAX);
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const firstResolved = resolveJudgment(first.state, false);
    if (!firstResolved.ok) return;

    const second = attemptContact(firstResolved.state, C, MAX);
    if (!second.ok) return;
    const secondResolved = resolveJudgment(second.state, true);
    expect(secondResolved.ok).toBe(true);
    if (!secondResolved.ok) return;

    expect(isDone(secondResolved.state, MAX)).toBe(true);
  });

  it("restarting via playRole fully clears contacts, pending judgment and the log", () => {
    const afterRole = playRole(A);
    const contacted = attemptContact(afterRole, B, MAX);
    if (!contacted.ok) return;
    const resolved = resolveJudgment(contacted.state, true);
    if (!resolved.ok) return;

    const restarted = playRole(C);
    expect(restarted.contacted).toEqual([]);
    expect(restarted.judgmentLog).toEqual([]);
    expect(restarted.judgmentPending).toBe(false);
    expect(restarted.pendingTarget).toBeNull();
  });

  it("cannot contact yourself, an already-contacted target, or anyone once out of contacts", () => {
    const afterRole = playRole(A);
    expect(canContactTarget(afterRole, A, MAX)).toBe(false); // self

    const contacted = attemptContact(afterRole, B, MAX);
    if (!contacted.ok) return;
    const resolved = resolveJudgment(contacted.state, false);
    if (!resolved.ok) return;
    expect(canContactTarget(resolved.state, B, MAX)).toBe(false); // already contacted

    const second = attemptContact(resolved.state, C, MAX);
    if (!second.ok) return;
    const secondResolved = resolveJudgment(second.state, false);
    if (!secondResolved.ok) return;
    expect(canContactTarget(secondResolved.state, "Anyone Else", MAX)).toBe(false); // out of contacts
  });

  it("a target cannot be contacted while a judgment is pending, even if otherwise eligible", () => {
    const afterRole = playRole(A);
    const contacted = attemptContact(afterRole, B, MAX);
    if (!contacted.ok) return;
    expect(canContactTarget(contacted.state, C, MAX)).toBe(false);
  });

  it("untouchedArchetypes names everyone except yourself and those contacted", () => {
    const all = [A, B, C, "Fourth Role"];
    const afterRole = playRole(A);
    const contacted = attemptContact(afterRole, B, MAX);
    if (!contacted.ok) return;
    const resolved = resolveJudgment(contacted.state, false);
    if (!resolved.ok) return;

    expect(untouchedArchetypes(resolved.state, all)).toEqual([C, "Fourth Role"]);
  });

  it("[negative example] a state machine that let contacts pass through unresolved judgments would go done too early", () => {
    // Guards against silently regressing the fix: without the judgment-pending
    // check, attemptContact would succeed here and isDone would (wrongly)
    // consider a partially-judged run complete.
    const afterRole = playRole(A);
    const first = attemptContact(afterRole, B, MAX);
    if (!first.ok) return;
    const brokenSecondAttempt = attemptContact(first.state, C, MAX);
    expect(brokenSecondAttempt.ok).toBe(false);
  });
});
