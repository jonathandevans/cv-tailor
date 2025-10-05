"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { signUpSchema } from "@/lib/zod-schemas";
import { Loader2 } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function SignUpForm() {
  const { signIn } = useAuthActions();

  const [email, setEmail] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);

  const [showVerify, setShowVerify] = useState<boolean>(false);
  const [verifyError, setVerifyError] = useState<string>("");
  const [verifyPending, setVerifyPending] = useState<boolean>(false);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: signUpSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (event, { formData, submission }) => {
      event.preventDefault();

      setPending(true);
      setError("");

      if (submission?.status === "success") {
        signIn("password", formData)
          .catch((error) => {
            setError(
              error instanceof Error
                ? error.message
                : "Oops something went wrong! Please try again later."
            );
          })
          .finally(() => {
            setPending(false);
            setShowVerify(true);
          });
      }
    },
  });

  return (
    <main className="relative w-full min-w-sm min-h-[32rem] h-screen overflow-x-hidden">
      <Card
        className={cn(
          "w-[95%] max-w-md absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] duration-500 pointer-events-auto ease-in-out",
          showVerify && "opacity-0 translate-x-[-200%] pointer-events-none"
        )}
        aria-hidden={showVerify}
      >
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
          >
            <input name="flow" type="hidden" value="signUp" />

            <div className="relative flex flex-col gap-2">
              <label className="absolute left-3 top-2 text-[0.7rem]">
                Email
              </label>
              <Input
                type="email"
                className="px-3 pb-1.5 pt-7 h-auto"
                disabled={pending}
                key={fields.email.key}
                name={fields.email.name}
                defaultValue={fields.email.initialValue}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                tabIndex={showVerify ? -1 : 0}
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
                className="px-3 pb-1.5 pt-7 h-auto"
                type="password"
                disabled={pending}
                key={fields.password.key}
                name={fields.password.name}
                defaultValue={fields.password.initialValue}
                tabIndex={showVerify ? -1 : 0}
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
                className="px-3 pb-1.5 pt-7 h-auto"
                type="password"
                disabled={pending}
                key={fields.confirmPassword.key}
                name={fields.confirmPassword.name}
                defaultValue={fields.confirmPassword.initialValue}
                tabIndex={showVerify ? -1 : 0}
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
              tabIndex={showVerify ? -1 : 0}
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
            className="text-xs hover:underline text-neutral-500 mx-auto focus:outline-none focus:shadow-md focus:underline"
            href="/sign-in"
            tabIndex={showVerify ? -1 : 0}
          >
            Already have an account? Sign in
          </Link>
        </CardFooter>
      </Card>

      <Card
        className={cn(
          "w-[95%] max-w-md absolute left-[50%] top-[50%] translate-x-[100%] translate-y-[-50%] duration-500 opacity-0 pointer-events-none ease-in-out",
          showVerify && "opacity-100 translate-x-[-50%] pointer-events-auto"
        )}
        aria-hidden={!showVerify}
      >
        <CardHeader>
          <CardTitle className="text-2xl">Verify email.</CardTitle>
          <CardDescription>
            Before we can finish creating your account we must verify your
            email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 justify-center items-center"
            onSubmit={(e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              setVerifyPending(true);
              setVerifyError("");

              signIn("password", formData)
                .catch((error) => {
                  setVerifyError("Could not verify");
                })
                .finally(() => {
                  setVerifyPending(false);
                });
            }}
          >
            <input name="flow" type="hidden" value="email-verification" />
            <input name="redirect" type="hidden" value="/dashboard" />
            <input name="email" value={email} type="hidden" />

            <InputOTP
              maxLength={8}
              name="code"
              className="w-full"
              pattern={REGEXP_ONLY_DIGITS}
              tabIndex={showVerify ? 0 : -1}
              disabled={verifyPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              -
              <InputOTPGroup>
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
                <InputOTPSlot index={6} />
                <InputOTPSlot index={7} />
              </InputOTPGroup>
            </InputOTP>

            {verifyError && (
              <p className="text-sm text-red-500">{verifyError}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={pending}
              tabIndex={showVerify ? 0 : -1}
            >
              {verifyPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                "Verify email"
              )}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="hover:cursor-pointer w-full"
              onClick={() => setShowVerify(false)}
              tabIndex={showVerify ? 0 : -1}
              disabled={verifyPending}
            >
              {verifyPending ? (
                <Loader2 className="animate-spin size-4" />
              ) : (
                "Cancel"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
