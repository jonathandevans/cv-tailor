import * as z from "zod";

export const signUpSchema = z
  .object({
    name: z.string({
      error: (iss) =>
        iss.input === undefined ? "Name is required" : "Invalid name",
    }),
    email: z.email({
      error: (iss) =>
        iss.input === undefined ? "Email is required" : "Invalid email",
    }),
    password: z
      .string({
        error: (iss) =>
          iss.input === undefined ? "Password is required" : "Invalid password",
      })
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters"),
    confirmPassword: z.optional(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.email({
    error: (iss) =>
      iss.input === undefined ? "Email is required" : "Invalid email",
  }),
  password: z.string({
    error: (iss) =>
      iss.input === undefined ? "Password is required" : "Invalid password",
  }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({
        error: (iss) =>
          iss.input === undefined ? "Password is required" : "Invalid password",
      })
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be at most 32 characters"),
    confirmPassword: z.optional(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const createCVSchema = z.object({
  name: z.string({
    error: (iss) =>
      iss.input === undefined ? "Name is required" : "Invalid name",
  }),
});
