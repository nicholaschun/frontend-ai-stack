/**
 * Shared, cross-cutting types only. Feature-specific types live inside their
 * own slice under `features/<name>/`. Keep this file small on purpose.
 */

/** A value that may still be loading. */
export type Maybe<T> = T | null | undefined;

/** Standard paginated envelope for list endpoints. */
export type Paginated<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

/** Re-exported so callers can import the action contract from one place. */
export type { ActionResponse, ActionError } from "@/lib/result";
