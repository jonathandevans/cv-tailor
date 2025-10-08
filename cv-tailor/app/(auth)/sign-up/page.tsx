import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { SignUpForm } from "../_components/sign-up-form";

export const metadata: Metadata = generateMetadata({ title: "Sign Up" });

export default function SignUpRoute() {
  return <SignUpForm />;
}
