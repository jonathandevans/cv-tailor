"use client";

import { useActionState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { createCVAction } from "@/app/dashboard/actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { createCVSchema } from "@/lib/zod-schemas";
import { Loader2, Plus, PlusCircle } from "lucide-react";

export function CreateCVButton() {
  const [prevResult, createCV, pending] = useActionState(
    createCVAction,
    undefined
  );
  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createCVSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-sm border-2 border-neutral-300 dark:border-neutral-500 aspect-[1/1.414] max-w-[12rem] shadow-lg hover:shadow-xl transition-all overflow-hidden w-full cursor-pointer flex flex-col items-center justify-center gap-2 border-dashed">
          <PlusCircle className="size-10" />
          <span className="text-sm">Create A New CV</span>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a CV</DialogTitle>
          <DialogDescription>
            Enter the name of your new CV before you get to entering the
            details.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          id={form.id}
          onSubmit={form.onSubmit}
          action={createCV}
        >
          <div className="flex flex-col gap-2">
            <Label>CV Name</Label>
            <Input
              type="text"
              disabled={pending}
              key={fields.name.key}
              name={fields.name.name}
              defaultValue={fields.name.initialValue}
            />
            {fields.name.errors?.map((item, index) => (
              <p key={index} className="text-red-500 text-xs">
                {item}
              </p>
            ))}
          </div>

          {prevResult?.error && (
            <p className="text-xs text-red-500">{prevResult.error}</p>
          )}

          <Button
            type="submit"
            disabled={pending}
            className="hover:cursor-pointer"
          >
            {pending ? <Loader2 className="animate-spin size-4" /> : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
