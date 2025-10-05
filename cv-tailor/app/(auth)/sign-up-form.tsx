"use client";

import { useRef, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Loader2 } from "lucide-react";
import { signUpSchema } from "@/lib/zod-schemas";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SignUpForm() {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (event, { formData, submission }) => {
      event.preventDefault();

      setError("");

      if (submission?.status === "error") return;

      authClient.signUp
        .email(
          {
            email: formData.get(fields.email.name) as string,
            password: formData.get(fields.password.name) as string,
            name: formData.get(fields.name.name) as string,
            callbackURL: "/dashboard",
          },
          {
            onRequest: (ctx) => {
              setPending(true);
            },
            onSuccess: (ctx) => {
              formRef.current?.reset();
              setOpenDialog(true);
            },
            onError: (ctx) => {
              setError(ctx.error.message);
            },
          }
        )
        .finally(() => {
          setPending(false);
        });
    },
  });

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your email.</DialogTitle>
            <DialogDescription>
              We've just sent you an email with a link. Click that link to start
              using your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild>
              <Link href="/dashboard">Just verified</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="w-full min-h-screen flex items-center justify-center">
        <Card className="w-[95%] max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign up.</CardTitle>
            <CardDescription>
              Sign up to start creating resumes to help you land your dream job.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-3"
              id={form.id}
              onSubmit={form.onSubmit}
              ref={formRef}
            >
              <div className="relative flex flex-col gap-2">
                <label className="absolute left-3 top-2 text-[0.7rem]">
                  Name
                </label>
                <Input
                  type="name"
                  disabled={pending}
                  key={fields.name.key}
                  name={fields.name.name}
                  defaultValue={fields.name.initialValue}
                  className="px-3 pb-1.5 pt-7 h-auto"
                />
                {fields.name.errors?.map((item, index) => (
                  <p key={index} className="text-red-500 text-xs">
                    {item}
                  </p>
                ))}
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="absolute left-3 top-2 text-[0.7rem]">
                  Email
                </label>
                <Input
                  type="email"
                  disabled={pending}
                  key={fields.email.key}
                  name={fields.email.name}
                  defaultValue={fields.email.initialValue}
                  className="px-3 pb-1.5 pt-7 h-auto"
                />
                {fields.email.errors?.map((item, index) => (
                  <p key={index} className="text-red-500 text-xs">
                    {item}
                  </p>
                ))}
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="absolute left-3 top-2 text-[0.7rem]">
                  Password
                </label>
                <Input
                  type="password"
                  disabled={pending}
                  key={fields.password.key}
                  name={fields.password.name}
                  defaultValue={fields.password.initialValue}
                  className="px-3 pb-1.5 pt-7 h-auto"
                />
                {fields.password.errors?.map((item, index) => (
                  <p key={index} className="text-red-500 text-xs">
                    {item}
                  </p>
                ))}
              </div>

              <div className="relative flex flex-col gap-2">
                <label className="absolute left-3 top-2 text-[0.7rem]">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  disabled={pending}
                  key={fields.confirmPassword.key}
                  name={fields.confirmPassword.name}
                  defaultValue={fields.confirmPassword.initialValue}
                  className="px-3 pb-1.5 pt-7 h-auto"
                />
                {fields.confirmPassword.errors?.map((item, index) => (
                  <p key={index} className="text-red-500 text-xs">
                    {item}
                  </p>
                ))}
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={pending}
                className="hover:cursor-pointer"
              >
                {pending ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Link
              href="/sign-in"
              className="block mx-auto w-fit text-xs hover:underline text-gray-500 focus:underline focus:outline-none focus:shadow-md"
            >
              Already have an account? Sign in
            </Link>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
