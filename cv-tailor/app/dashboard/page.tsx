"use client"

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function DashboardRoute() {
  return <main>
    <Button onClick={async () => {
      await authClient.signOut()
      redirect("/")
    }}>Sign out</Button>
  </main>
}
