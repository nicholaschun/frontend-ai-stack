"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Accessible form field scaffold.
 *
 * Wraps a single control and wires up `id`, `aria-invalid`, and
 * `aria-describedby` (hint + error) automatically, so callers get correct
 * label association and screen-reader announcements without repeating ARIA
 * plumbing. Inline error state is styled from the same `aria-invalid` the
 * control receives — the visual and the semantic never drift apart.
 *
 * Usage:
 *   <FormField label="Email" error={errors.email} hint="Work email only.">
 *     <FormControl>
 *       <Input type="email" name="email" />
 *     </FormControl>
 *   </FormField>
 */

type FieldContextValue = {
  controlId: string;
  hintId: string;
  errorId: string;
  invalid: boolean;
  describedBy: string | undefined;
};

const FieldContext = React.createContext<FieldContextValue | null>(null);

function useFormField(): FieldContextValue {
  const ctx = React.useContext(FieldContext);
  if (!ctx) {
    throw new Error("FormControl must be used within a <FormField>.");
  }
  return ctx;
}

interface FormFieldProps extends React.ComponentProps<"div"> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  required?: boolean;
}

function FormField({
  label,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FormFieldProps) {
  const reactId = React.useId();
  const invalid = Boolean(error);
  const value: FieldContextValue = {
    controlId: `${reactId}-control`,
    hintId: `${reactId}-hint`,
    errorId: `${reactId}-error`,
    invalid,
    describedBy:
      [hint ? `${reactId}-hint` : null, invalid ? `${reactId}-error` : null]
        .filter(Boolean)
        .join(" ") || undefined,
  };

  return (
    <FieldContext.Provider value={value}>
      <div className={cn("flex flex-col gap-1.5", className)} {...props}>
        {label ? (
          <Label htmlFor={value.controlId}>
            {label}
            {required ? (
              <span className="text-destructive" aria-hidden="true">
                {" "}
                *
              </span>
            ) : null}
          </Label>
        ) : null}
        {children}
        {hint && !invalid ? (
          <p id={value.hintId} className="text-muted-foreground text-xs">
            {hint}
          </p>
        ) : null}
        {invalid ? (
          <p
            id={value.errorId}
            className="text-destructive text-xs font-medium"
            aria-live="polite"
          >
            {error}
          </p>
        ) : null}
      </div>
    </FieldContext.Provider>
  );
}

/** Forwards the field's id / aria-* props onto its single control child. */
function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { controlId, invalid, describedBy } = useFormField();
  return (
    <Slot
      id={controlId}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      {...props}
    />
  );
}

export { FormField, FormControl, useFormField };
