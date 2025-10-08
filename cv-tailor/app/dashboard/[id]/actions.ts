"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";

export async function getCVAction(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) return { error: "Unauthorised" };

  return await db.cV.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });
}
