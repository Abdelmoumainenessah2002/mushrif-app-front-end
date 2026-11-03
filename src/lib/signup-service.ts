import { z } from "zod";
import { emailSchema, type AuthResult, type OAuthProvider } from "@/lib/auth-service";

/**
 * Registration contract for the future Node.js backend.
 * The payload contains exactly these seven keys — nothing else is ever sent.
 * dateOfBirth is an ISO calendar date string "YYYY-MM-DD" (no time, no timezone);
 * phoneNumber is E.164-style "+<country code><national digits>".
 * Both formats are assumptions until the backend contract confirms them.
 */
export type RegistrationPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  password: string;
};
export type RegistrationField = keyof RegistrationPayload;
export const REGISTRATION_FIELDS: RegistrationField[] = [
  "firstName",
  "lastName",
  "email",
  "phoneNumber",
  "dateOfBirth",
  "gender",
  "password",
];

/**
 * UNCONFIRMED: the backend's accepted gender values were not found in any supplied model.
 * Align `value` with the real enum before integration.
 */
export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

/** Country dial codes offered in the phone selector. Order: Algeria first, then alphabetical. */
export const COUNTRY_CODES = [
  { iso: "DZ", name: "Algeria", dial: "213" },
  { iso: "BH", name: "Bahrain", dial: "973" },
  { iso: "CA", name: "Canada", dial: "1" },
  { iso: "EG", name: "Egypt", dial: "20" },
  { iso: "FR", name: "France", dial: "33" },
  { iso: "DE", name: "Germany", dial: "49" },
  { iso: "JO", name: "Jordan", dial: "962" },
  { iso: "KW", name: "Kuwait", dial: "965" },
  { iso: "LB", name: "Lebanon", dial: "961" },
  { iso: "LY", name: "Libya", dial: "218" },
  { iso: "MA", name: "Morocco", dial: "212" },
  { iso: "OM", name: "Oman", dial: "968" },
  { iso: "QA", name: "Qatar", dial: "974" },
  { iso: "SA", name: "Saudi Arabia", dial: "966" },
  { iso: "TN", name: "Tunisia", dial: "216" },
  { iso: "TR", name: "Türkiye", dial: "90" },
  { iso: "AE", name: "United Arab Emirates", dial: "971" },
  { iso: "GB", name: "United Kingdom", dial: "44" },
  { iso: "US", name: "United States", dial: "1" },
] as const;
export type CountryIso = (typeof COUNTRY_CODES)[number]["iso"];
export const dialFor = (iso: string) => COUNTRY_CODES.find((c) => c.iso === iso)?.dial ?? "";

/** Frontend password rules. Align with the backend policy before integration. */
export const PASSWORD_RULES = [
  { id: "length", label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { id: "lower", label: "A lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { id: "upper", label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { id: "number", label: "A number", test: (v: string) => /\d/.test(v) },
  { id: "symbol", label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
] as const;
export function passwordStrength(value: string) {
  const met = PASSWORD_RULES.filter((r) => r.test(value)).length;
  const score = value.length === 0 ? 0 : met <= 2 ? 1 : met <= 4 ? 2 : value.length >= 12 ? 4 : 3;
  return { met, score, label: ["", "Weak", "Fair", "Good", "Strong"][score]! };
}

/** Today as a local calendar date "YYYY-MM-DD" — compared as strings, no timezone shift. */
export function localToday(now = new Date()) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}
const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/;
function isRealDate(value: string) {
  const m = isoDate.exec(value);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return (
    y >= 1900 && date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d
  );
}

const name = (label: string) =>
  z.string().trim().min(1, `Enter your ${label}.`).max(60, `Keep your ${label} under 60 characters.`);

export const fieldSchemas = {
  firstName: name("first name"),
  lastName: name("last name"),
  email: emailSchema.transform((v) => v.toLowerCase()),
  phoneCountry: z.string().refine((v) => dialFor(v) !== "", "Choose a country code."),
  phoneNational: z
    .string()
    .trim()
    .min(1, "Enter your phone number.")
    .refine((v) => /^[\d\s().-]+$/.test(v), "Use digits only. Choose the country code separately.")
    .refine(
      (v) => !v.replace(/\D/g, "").startsWith("0"),
      "Remove the leading 0 — the country code replaces it.",
    ),
  dateOfBirth: z
    .string()
    .min(1, "Enter your date of birth.")
    .refine(isRealDate, "Enter a valid date.")
    .refine((v) => !isRealDate(v) || v <= localToday(), "Date of birth can’t be in the future."),
  gender: z
    .string()
    .refine((v) => GENDER_OPTIONS.some((g) => g.value === v), "Select an option."),
  password: z
    .string()
    .refine((v) => PASSWORD_RULES.every((r) => r.test(v)), "Password doesn’t meet all requirements."),
};

export const signupSchema = z
  .object({ ...fieldSchemas, confirmPassword: z.string().min(1, "Confirm your password.") })
  .superRefine((v, ctx) => {
    const digits = (dialFor(v.phoneCountry) + v.phoneNational.replace(/\D/g, "")).length;
    if (v.phoneNational.trim() && (digits < 8 || digits > 15))
      ctx.addIssue({ code: "custom", path: ["phoneNational"], message: "Enter a valid phone number." });
    if (v.confirmPassword && v.password !== v.confirmPassword)
      ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: "Passwords don’t match." });
  });
export type SignupFormValues = z.input<typeof signupSchema>;
export type SignupParsed = z.output<typeof signupSchema>;

/** Joins country code and national digits. Only formatting characters are removed. */
export function formatPhone(country: string, national: string) {
  return `+${dialFor(country)}${national.replace(/\D/g, "")}`;
}

/** Builds the exact backend payload. confirmPassword and UI state are deliberately dropped. */
export function toRegistrationPayload(v: SignupParsed): RegistrationPayload {
  return {
    firstName: v.firstName,
    lastName: v.lastName,
    email: v.email,
    phoneNumber: formatPhone(v.phoneCountry, v.phoneNational),
    dateOfBirth: v.dateOfBirth,
    gender: v.gender,
    password: v.password,
  };
}

/** Result of starting OAuth registration. `missing` lists fields the provider didn't supply. */
export type OAuthSignupResult =
  | (AuthResult & { status: "error" })
  | { status: "success" }
  | {
      status: "needs_profile";
      provider: OAuthProvider;
      missing: Array<Exclude<RegistrationField, "password">>;
    };

export interface RegistrationService {
  register(payload: RegistrationPayload): Promise<AuthResult>;
  beginOAuthSignup(provider: OAuthProvider): Promise<OAuthSignupResult>;
  completeOAuthProfile(
    provider: OAuthProvider,
    fields: Partial<Omit<RegistrationPayload, "password">>,
  ): Promise<AuthResult>;
}

// Explicitly unconfigured: no endpoint, method or request exists until the backend contract is provided.
export const registrationService: RegistrationService = {
  register: async () => ({ status: "error", code: "unconfigured" }),
  beginOAuthSignup: async () => ({ status: "error", code: "unconfigured" }),
  completeOAuthProfile: async () => ({ status: "error", code: "unconfigured" }),
};
