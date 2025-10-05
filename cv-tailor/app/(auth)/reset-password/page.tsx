import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { ResetPasswordForm } from "../reset-password-form";

export const metadata: Metadata = generateMetadata({ title: "Reset Password" });

export default function ResetPasswordRoute() {
  return <ResetPasswordForm />;
}
