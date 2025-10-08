"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { createCVSchema } from "@/lib/zod-schemas";
import { parseWithZod } from "@conform-to/zod/v4";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createCVAction(prevResult: any, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { error: "Unauthorised" };

  const submission = await parseWithZod(formData, {
    schema: createCVSchema,
    async: true,
  });
  if (submission.status !== "success") return { error: "Bad payload" };

  let cv = undefined;
  try {
    cv = await db.$transaction(async (tx) => {
      const cv = await tx.cV.create({
        data: { name: submission.value.name, userId: session.user.id },
      });
      await tx.summary.create({
        data: { cvId: cv.id },
      });

      return cv;
    });
  } catch (error) {
    return { error: "Oops something went wrong! Please try again later." };
  }

  redirect(`/dashboard/${cv.id}/summary`);
}
