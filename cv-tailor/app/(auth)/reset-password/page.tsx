import { Metadata } from "next";
import { generateMetadata } from "@/lib/metadata";
import { PasswordResetForm } from "../password-reset-form";

export const metadata: Metadata = generateMetadata({
  title: "Forgotten Password",
});

export default function ResetPasswordRoute() {
  return <PasswordResetForm />;
}
