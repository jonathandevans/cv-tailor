"use client";

import { useRef, useState } from "react";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod/v4";
import { Loader2 } from "lucide-react";
import { resetPasswordSchema, signUpSchema } from "@/lib/zod-schemas";
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
  notFound,
  redirect,
  useParams,
  useSearchParams,
} from "next/navigation";
import { toast } from "sonner";

export function ResetPasswordForm() {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const formRef = useRef<HTMLFormElement>(null);

  const searchParams = useSearchParams();
  if (!searchParams.get("token")) notFound();

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: resetPasswordSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onSubmit: async (event, { formData, submission }) => {
      event.preventDefault();

      setError("");

      if (submission?.status === "error") return;

      authClient
        .resetPassword(
          {
            newPassword: formData.get(fields.password.name) as string,
            token: searchParams.get("token") as string,
          },
          {
            onRequest: (ctx) => {
              setPending(true);
            },
            onSuccess: (ctx) => {
              toast.success("Password reset");
              redirect("/sign-in");
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
    <main className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-[95%] max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset password.</CardTitle>
          <CardDescription>
            Enter your new password to reset your login details.
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
                New Password
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
                Confirm New Password
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
                "Reset password"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link
            href="/sign-in"
            className="block mx-auto w-fit text-xs hover:underline text-gray-500 focus:underline focus:outline-none focus:shadow-md"
          >
            Go back
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
