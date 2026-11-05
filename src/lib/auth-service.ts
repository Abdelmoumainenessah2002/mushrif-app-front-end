import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .email("Enter a valid email address.");
const phonePattern = /^\+?[\d\s().-]+$/;
export const identifierSchema = z
  .string()
  .trim()
  .min(1, "Enter your email or phone number.")
  .refine(
    (value) =>
      emailSchema.safeParse(value).success ||
      (phonePattern.test(value) &&
        value.replace(/\D/g, "").length >= 7 &&
        value.replace(/\D/g, "").length <= 15),
    "Enter a valid email address or phone number.",
  );
export const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string().min(1, "Enter your password."),
});
export const recoverySchema = z.object({ email: emailSchema });
export type LoginInput = z.infer<typeof loginSchema> & { rememberMe: boolean };
export type OAuthProvider = "google" | "github" | "facebook";
export type AuthIssue =
  | "unconfigured"
  | "invalid_credentials"
  | "invalid_session"
  | "invalid_token"
  | "expired_token"
  | "rate_limited"
  | "network"
  | "server"
  | "validation";
export type AuthResult =
  | { status: "success" }
  | {
      status: "error";
      code: AuthIssue;
      /** Safe, user-facing messages keyed by form field name . */
      fieldErrors?: Partial<
        Record<
          | "identifier"
          | "password"
          | "newPassword"
          | "email"
          | "firstName"
          | "lastName"
          | "phoneNumber"
          | "dateOfBirth"
          | "gender",
          string
        >
      >;
    };
export interface AuthService {
  signIn(input: LoginInput): Promise<AuthResult>;
  requestRecovery(email: string): Promise<AuthResult>;
  beginOAuth(provider: OAuthProvider): Promise<AuthResult>;
}
// Replace these methods with the real backend contract. Never store credentials here.
export const authService: AuthService = {
  signIn: async () => ({ status: "error", code: "unconfigured" }),
  requestRecovery: async () => ({ status: "error", code: "unconfigured" }),
  beginOAuth: async () => ({ status: "error", code: "unconfigured" }),
};
export const oauthProviders: { id: OAuthProvider; name: string; enabled: boolean }[] = [
  { id: "google", name: "Google", enabled: true },
  { id: "github", name: "GitHub", enabled: true },
  { id: "facebook", name: "Facebook", enabled: true },
];
export type AuthOperation = "login" | "recovery" | "signup" | "reset" | OAuthProvider;
export function authMessage(code: AuthIssue, operation: AuthOperation) {
  if (code === "unconfigured") {
    if (operation === "reset")
      return "Password reset is not connected yet. Your password has not been changed.";
    if (operation === "recovery")
      return "Password recovery is not connected yet. No email has been sent.";
    if (operation === "login")
      return "Sign-in is not connected yet. No account has been signed in.";
    if (operation === "signup")
      return "Registration is not connected yet. No account has been created.";
    return `${oauthProviders.find((provider) => provider.id === operation)?.name ?? operation} sign-in is not configured yet.`;
  }
  const messages: Record<Exclude<AuthIssue, "unconfigured">, string> = {
    invalid_credentials: "We couldn’t sign you in with those details. Please try again.",
    invalid_session: "Your session is no longer valid. Please sign in again.",
    invalid_token: "This reset link is invalid. Request a new link to continue.",
    expired_token: "This reset link has expired. Request a new link to continue.",
    rate_limited: "Too many attempts. Please wait a moment before trying again.",
    network: "We couldn’t connect. Check your connection and try again.",
    server: "Something went wrong. Please try again in a moment.",
    validation: "Please check your details and try again.",
  };
  return messages[code];
}
