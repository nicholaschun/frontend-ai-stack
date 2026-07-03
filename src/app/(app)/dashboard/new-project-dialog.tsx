"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FormField, FormControl } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

/**
 * Demonstrates the dialog + form-field primitives with progressive validation:
 * the field validates on blur, then re-validates on change once it has errored.
 * (A real slice would submit through a Zod-validated Server Action returning an
 * `ActionResponse`; here we stop at a toast to keep the skeleton dependency-free.)
 */
export function NewProjectDialog() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [touched, setTouched] = React.useState(false);

  function validate(value: string): string | null {
    const trimmed = value.trim();
    if (trimmed.length < 2) return "Use at least 2 characters.";
    if (trimmed.length > 40) return "Keep it under 40 characters.";
    return null;
  }

  function onChange(value: string) {
    setName(value);
    if (touched) setError(validate(value));
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const validationError = validate(name);
    setTouched(true);
    setError(validationError);
    if (validationError) return;

    toast.success("Project created", { description: name.trim() });
    setOpen(false);
    setName("");
    setTouched(false);
    setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          New project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Create a project</DialogTitle>
            <DialogDescription>
              Projects group your work and control access. You can rename it
              later.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5">
            <FormField
              label="Project name"
              hint="Shown to everyone in your workspace."
              error={error}
              required
            >
              <FormControl>
                <Input
                  value={name}
                  autoComplete="off"
                  placeholder="Acme migration"
                  onChange={(e) => onChange(e.target.value)}
                  onBlur={() => {
                    setTouched(true);
                    setError(validate(name));
                  }}
                />
              </FormControl>
            </FormField>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create project</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
