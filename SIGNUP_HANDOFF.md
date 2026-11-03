# Mushrif sign-up handoff

## Route
`/signup` — public, uses the shared `AuthLayout`, fields, submit button, feedback and OAuth buttons from Login.

## Files
Created: `src/routes/signup.tsx`, `src/lib/signup-service.ts`, `src/components/auth/SignupForm.tsx`, `src/components/auth/SignupFields.tsx`, `src/test/signup.test.tsx`, `SIGNUP_HANDOFF.md`.
Modified (small shared changes): `src/lib/auth-service.ts` (signup message + field-error keys), `src/components/auth/AuthFeedback.tsx` (signup success variant), `src/components/auth/AuthForms.tsx` (exported `Field`/`SubmitButton`; "Create an account" link on Login), `src/components/auth/AuthLayout.tsx` (fixed a reduced-motion hydration mismatch), `src/test/app-routing.test.tsx`, `AGENTS.md`, `roadmap.md`. `src/routeTree.gen.ts` regenerated automatically.
No dependencies, backend, database, Docker, env or deployment config changed.

## Payload
`toRegistrationPayload()` returns exactly `{ firstName, lastName, email, phoneNumber, dateOfBirth, gender, password }`. `confirmPassword`, strength, and UI state are dropped.
- `dateOfBirth`: native date input string `YYYY-MM-DD`, passed through unchanged (no `Date` conversion → no timezone shift).
- `phoneNumber`: `+<dial code><digits>`; only spaces/dashes/brackets removed. A live hint shows the exact value that will be sent.

## Validation
Names required, trimmed, ≤60 chars · email trimmed, lowercased, format-checked · country code required, number digits-only, no leading trunk 0, 8–15 total digits · date required, real calendar date, ≥1900, not in the future (no minimum age invented) · gender must be one of `GENDER_OPTIONS` · password: 8+ chars, lower, upper, number, symbol (`PASSWORD_RULES`) · confirmation must match. Errors show inline plus a summary on invalid submit; first invalid field is focused. Pending state disables the form and blocks duplicate submits.

## Service / integration
`registrationService` (`register`, `beginOAuthSignup`, `completeOAuthProfile`) returns `unconfigured` — no requests are made. Success UI only appears after a service returns `success`. Backend `fieldErrors` keyed by payload names are mapped onto fields (`phoneNumber` → phone input). Network/rate-limit/server codes use the existing shared messages. Nothing is written to local/session storage.

OAuth (Google, GitHub, Facebook) all show "not configured yet". If `beginOAuthSignup` later returns `needs_profile` with `missing` fields, `ProfileCompletionForm` collects only those fields (never a password) and calls `completeOAuthProfile`.

## Needed from backend
Endpoint + method, accepted gender values (current `male`/`female` are placeholders), date and phone formats, password policy, error response shape/field names, post-registration behaviour (email verification? auto sign-in?), OAuth initiation/callback flow and which fields providers leave missing, terms/privacy URLs (no acknowledgement added since none exist).

## Verification
- `bun run test`: 4 files, 27 tests passed.
- `bunx eslint src vite.config.ts vitest.config.ts`: 0 errors, 6 pre-existing warnings in UI primitives. Typecheck clean; preview build OK.
- Chromium: `/signup` direct load, empty submit summary + focus, full valid submit → unconfigured message, OAuth message, no storage, Login ↔ Sign up links, Forgot password renders, keyboard tab order, no overflow at 1280/768/390, reduced-motion at 390, no console errors.

## Run locally
```bash
bun install
bun run dev      # open /signup
bun run test
bun run lint
bun run build
```
