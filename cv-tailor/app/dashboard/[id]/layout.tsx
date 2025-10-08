"use client";

import { ReactNode } from "react";
import { UserButton } from "@/components/ui/user-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { QueryKey, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getCVAction } from "./actions";

export default function IdLayout({ children }: { children: ReactNode }) {
  const { id } = useParams();

  return (
    <>
      <header className="flex justify-between items-center px-16 py-2 border-b">
        <div className="flex items-center justify-center gap-4">
          <Button asChild variant="outline" size="icon-sm">
            <Link href="/dashboard">
              <ChevronLeft />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2 pointer-events-none">
            CV Tailor <span className="text-4xl text-blue-500">/</span>{" "}
            Dashboard
          </h1>
        </div>

        <UserButton />
      </header>
      <main></main>
      {children}
    </>
  );
}
