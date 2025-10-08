"use client";

import { useRef, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/lib/zod-schemas";
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
import { redirect } from "next/navigation";
import { toast } from "sonner";

export function SignInForm() {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signInSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (event, { formData, submission }) => {
      event.preventDefault();

      setError("");

      if (submission?.status === "error") return;

      authClient.signIn
        .email(
          {
            email: formData.get(fields.email.name) as string,
            password: formData.get(fields.password.name) as string,
            callbackURL: "/dashboard",
          },
          {
            onRequest: (ctx) => {
              setPending(true);
            },
            onSuccess: (ctx) => {
              redirect("/dashboard");
            },
            onError: (ctx) => {
              if (ctx.error.status === 403) {
                authClient.sendVerificationEmail({
                  email: formData.get(fields.email.name) as string,
                  callbackURL: "/dashboard",
                });
                setOpenDialog(true);

                return;
              }

              setError(ctx.error.message);
            },
          }
        )
        .finally(() => {
          setPending(false);
        });
    },
  });

  const [openPasswordDialog, setOpenPasswordDialog] = useState<boolean>(false);
  const [passwordDialogError, setPasswordDialogError] = useState<string>("");
  const [passwordDialogPending, setPasswordDialogPending] =
    useState<boolean>(false);

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify your email.</DialogTitle>
            <DialogDescription>
              You haven't verified your email yet. We've just sent you an email
              with a link. Click that link to start using your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild>
              <Link href="/dashboard">Just verified</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forgotten your password.</DialogTitle>
            <DialogDescription>
              Enter your email and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();

              setPasswordDialogPending(true);
              const formData = new FormData(e.currentTarget);

              const { data, error } = await authClient.requestPasswordReset({
                email: formData.get("email") as string,
                redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`,
              });
              if (error) {
                setPasswordDialogError(
                  error.message || "Oops something went wrong!"
                );
                setPasswordDialogPending(false);
                return;
              }

              setOpenPasswordDialog(false);
              toast.success("Email sent!");

              setPasswordDialogPending(false);
            }}
          >
            <div className="relative flex flex-col gap-2">
              <label className="absolute left-3 top-2 text-[0.7rem]">
                Email
              </label>
              <Input
                type="email"
                name="email"
                disabled={passwordDialogPending}
                className="px-3 pb-1.5 pt-7 h-auto"
              />
            </div>

            {passwordDialogError && (
              <p className="text-sm text-red-500">{passwordDialogError}</p>
            )}

            <Button type="submit" disabled={passwordDialogPending}>
              Send link
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <main className="w-full min-h-screen flex items-center justify-center">
        <Card className="w-[95%] max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Sign in.</CardTitle>
            <CardDescription>
              Sign in to your account to access your resumes and create new
              ones.
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

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={pending}
                className="hover:cursor-pointer"
              >
                {pending ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center gap-2">
            <button
              className="block mx-auto w-fit text-xs hover:underline text-gray-500 focus:underline focus:outline-none focus:shadow-md cursor-pointer"
              onClick={() => {
                setOpenPasswordDialog(true);
              }}
            >
              Forgotten password?
            </button>
            <Link
              href="/sign-up"
              className="block mx-auto w-fit text-xs hover:underline text-gray-500 focus:underline focus:outline-none focus:shadow-md"
            >
              Don't have an account yet? Sign up
            </Link>
          </CardFooter>
        </Card>
      </main>
    </>
  );
}
