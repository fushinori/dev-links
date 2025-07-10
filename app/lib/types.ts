import { z } from "zod";

const BaseSignUpSchema = z.object({
  email: z
    .string({ required_error: "Can't be empty" })
    .email("Please enter a valid email"),
  password: z.string().min(8, "Password should be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Password should be at least 8 characters long"),
});

export const LoginSchema = BaseSignUpSchema.omit({ confirmPassword: true });

// Add refinement to validate if both passwords match
export const SignUpSchema = BaseSignUpSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);
