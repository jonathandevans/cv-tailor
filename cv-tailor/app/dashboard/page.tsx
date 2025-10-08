import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { UserButton } from "@/components/ui/user-button";
import { db } from "@/lib/db";
import { useSession } from "@/lib/auth";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { CreateCVButton } from "./_components/create-cv-button";

export const metadata: Metadata = generateMetadata({ title: "Dashboard" });

export default async function DashboardRoute() {
  const session = await useSession();

  const cvs = await db.cV.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <>
      <header className="flex justify-between items-center px-16 py-2 border-b">
        <h1 className="text-xl font-semibold tracking-tight flex items-center gap-2 pointer-events-none">
          CV Tailor <span className="text-4xl text-blue-500">/</span> Dashboard
        </h1>

        <UserButton />
      </header>
      <main>
        <section className="bg-muted px-64 py-8">
          <h2 className="text-lg tracking-tight mb-2">Latest CVs</h2>
          <div className="flex gap-4">
            <CreateCVButton />
            {cvs.map((cv) => (
              <Link
                key={cv.id}
                href={`/dashboard/${cv.id}/summary`}
                className="rounded-sm border-2 border-neutral-300 aspect-[1/1.414] max-w-[12rem] shadow-lg hover:shadow-xl transition-all grid grid-rows-[3fr_1fr] overflow-hidden w-full"
              >
                <div
                  aria-hidden={true}
                  className="overflow-hidden flex justify-center items-center p-8 bg-neutral-100"
                >
                  <p className="font-semibold text-center text-sm text-muted-foreground">
                    Start editing your CV to get a preview
                  </p>
                </div>
                <div className="px-4 py-2 flex flex-col justify-center items-start bg-background">
                  <p className="text-sm">{cv.name}</p>
                  <p className="text-xs italic text-muted-foreground">
                    Last Updated {formatDate(new Date(cv.updatedAt))}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
