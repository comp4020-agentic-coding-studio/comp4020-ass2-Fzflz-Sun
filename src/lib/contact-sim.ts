// The Alignment Lab contact-window demo's decision logic, kept free of the
// DOM so it can be exercised directly by spec/contact-simulator.test.ts
// instead of only by grepping the component's source for variable names.
// src/components/ContactSimulator.astro wires this to real elements; nothing
// in here touches `document`.

export interface ContactSimState {
  you: string | null;
  contacted: string[];
  pendingTarget: string | null;
  judgmentPending: boolean;
  judgmentLog: Array<{ target: string; changed: boolean }>;
}

export function initialState(): ContactSimState {
  return { you: null, contacted: [], pendingTarget: null, judgmentPending: false, judgmentLog: [] };
}

/** Starting to play a role always fully resets the contact/judgment history. */
export function playRole(archetype: string): ContactSimState {
  return { you: archetype, contacted: [], pendingTarget: null, judgmentPending: false, judgmentLog: [] };
}

export type ContactRejection = "judgment-pending" | "out-of-contacts" | "already-contacted" | "is-self";

export type ContactAttempt =
  | { ok: true; state: ContactSimState }
  | { ok: false; reason: ContactRejection };

/**
 * A second contact must never be startable while an earlier one's judgment
 * is unresolved — that ordering is what let a fast second click silently
 * overwrite `pendingTarget` and drop a judgment record.
 */
export function attemptContact(state: ContactSimState, target: string, maxContacts: number): ContactAttempt {
  if (state.judgmentPending) return { ok: false, reason: "judgment-pending" };
  if (target === state.you) return { ok: false, reason: "is-self" };
  if (state.contacted.includes(target)) return { ok: false, reason: "already-contacted" };
  if (state.contacted.length >= maxContacts) return { ok: false, reason: "out-of-contacts" };
  return {
    ok: true,
    state: {
      ...state,
      contacted: [...state.contacted, target],
      pendingTarget: target,
      judgmentPending: true,
    },
  };
}

export type JudgmentResolution =
  | { ok: true; state: ContactSimState; target: string }
  | { ok: false };

/**
 * Resolving a judgment when none is pending must be a no-op: it must not
 * append a log entry, and it must not touch `pendingTarget`.
 */
export function resolveJudgment(state: ContactSimState, changed: boolean): JudgmentResolution {
  if (!state.judgmentPending || state.pendingTarget === null) return { ok: false };
  const target = state.pendingTarget;
  return {
    ok: true,
    target,
    state: {
      ...state,
      pendingTarget: null,
      judgmentPending: false,
      judgmentLog: [...state.judgmentLog, { target, changed }],
    },
  };
}

/** The meeting only starts once every contact has been made AND judged. */
export function isDone(state: ContactSimState, maxContacts: number): boolean {
  return !state.judgmentPending && state.contacted.length >= maxContacts;
}

export function canContactTarget(state: ContactSimState, target: string, maxContacts: number): boolean {
  if (target === state.you) return false;
  if (state.contacted.includes(target)) return false;
  if (state.contacted.length >= maxContacts) return false;
  if (state.judgmentPending) return false;
  return true;
}

export function untouchedArchetypes(state: ContactSimState, allArchetypes: string[]): string[] {
  return allArchetypes.filter((name) => name !== state.you && !state.contacted.includes(name));
}
