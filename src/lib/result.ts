import type { ZodError } from "zod";

/**
 * The single contract for every Server Action and mutation-style API result.
 *
 * A discriminated union so callers must handle both branches — no throwing
 * across the server/client boundary, no ambiguous nulls. `fieldErrors` carries
 * per-field validation messages for progressive form UIs.
 */
export type ActionError = {
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResponse<T = void> =
  { ok: true; data: T } | { ok: false; error: ActionError };

export function ok<T>(data: T): ActionResponse<T> {
  return { ok: true, data };
}

export function fail(message: string, code?: string): ActionResponse<never> {
  return { ok: false, error: { message, code } };
}

/** Build a failed response from a Zod validation error (for form actions). */
export function failValidation(
  error: ZodError,
  message = "Please fix the highlighted fields.",
): ActionResponse<never> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { ok: false, error: { message, code: "VALIDATION", fieldErrors } };
}
