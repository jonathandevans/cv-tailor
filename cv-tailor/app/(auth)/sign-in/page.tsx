import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { SignInForm } from "../sign-in-form";

export const metadata: Metadata = generateMetadata({ title: "Sign In" });

export default function SignInRoute() {
  return <SignInForm />;
}
