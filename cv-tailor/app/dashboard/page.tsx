"use client";

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

export default function DashboardRoute() {
  const { signOut } = useAuthActions();

  return (
    <>
      <Button
        onClick={() => {
          signOut();
        }}
      >
        Sign out
      </Button>
    </>
  );
}
