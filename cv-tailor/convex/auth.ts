import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./resend_verify";
import { ResendOTPPasswordReset } from "./resend_reset";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({ verify: ResendOTP, reset: ResendOTPPasswordReset })],
});
