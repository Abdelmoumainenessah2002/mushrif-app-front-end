import { z } from "zod";
import { PASSWORD_RULES } from "@/lib/signup-service";
import type { AuthResult } from "@/lib/auth-service";

export type ResetTokenState =
  | { status: "checking" }
  | { status: "missing" | "malformed" }
  | { status: "present"; token: string };

/** Presence is not verification. No backend token encoding/expiry contract is known. */
export function readResetToken(search: string): ResetTokenState {
  const tokens = new URLSearchParams(search).getAll("token");
  if (tokens.length === 0 || (tokens.length === 1 && tokens[0] === ""))
    return { status: "missing" };
  const token = tokens[0];
  if (tokens.length !== 1 || !token || /\s/u.test(token) || [...token].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127))
    return { status: "malformed" };
  return { status: "present", token };
}

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, "Enter your new password.")
      .refine(
        (value) => value === "" || PASSWORD_RULES.every((rule) => rule.test(value)),
        "Password doesn’t meet all requirements.",
      ),
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .superRefine((values, context) => {
    if (values.confirmPassword && values.confirmPassword !== values.newPassword)
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords don’t match.",
      });
  });
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordPayload = { token: string; newPassword: string };
export function toResetPasswordPayload(
  token: string,
  values: ResetPasswordValues,
): ResetPasswordPayload {
  return { token, newPassword: values.newPassword };
}
export interface ResetPasswordService {
  resetPassword(payload: ResetPasswordPayload): Promise<AuthResult>;
}
/** No endpoint, request, token verification, session or simulated success. */
export const resetPasswordService: ResetPasswordService = {
  resetPassword: async () => ({ status: "error", code: "unconfigured" }),
};
