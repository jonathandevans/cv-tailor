import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { SignUpForm } from "@/app/(auth)/sign-up-form";

export const metadata: Metadata = generateMetadata({ title: "Sign Up" });

export default function SignUpRoute() {
  return <SignUpForm />;
}
