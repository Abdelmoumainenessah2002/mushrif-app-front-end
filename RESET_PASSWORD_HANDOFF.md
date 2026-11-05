# Mushrif reset-password handoff

## Delivered

Public route: `/reset-password?token=RESET_TOKEN`. Direct navigation without a token shows a recovery-link request action instead of a password form. A present token is not described as verified; only the future backend can verify validity and expiry.

The form reuses Mushrif’s auth layout, inputs, buttons, feedback, strength indicator, existing design tokens and reduced-motion configuration. Both password fields have independent visibility toggles. Validation focuses the first invalid input; pending requests disable fields and prevent duplicate submissions. Backend-confirmed success clears both password fields, drops the consumed token from the address bar, and links to `/login` without signing in.

## Files

Created:
- `src/routes/reset-password.tsx`: public route, unique metadata, no-index and no-referrer hints.
- `src/components/auth/ResetPasswordForm.tsx`: form, missing/invalid/expired link states and submission handling.
- `src/lib/reset-password-service.ts`: isolated browser-safe token reader, validation schema, payload builder and unconfigured adapter.
- `src/test/reset-password.test.tsx`: 20 rule and state tests.
- `RESET_PASSWORD_HANDOFF.md`: this document.

Modified:
- `src/lib/auth-service.ts`: reset operation, safe error categories and newPassword field errors.
- `src/components/auth/AuthFeedback.tsx`: reset-success variant with sign-in link.
- `src/components/auth/AuthForms.tsx`: shared Field combines requirements and error accessibility descriptions.
- `src/test/app-routing.test.tsx`: reset route matching.
- `AGENTS.md` and `roadmap.md`: architecture and completion checklist.
- `src/routeTree.gen.ts`: regenerated automatically, not manually edited.

No dependency, backend, database, environment, hosting or deployment configuration changes. No publishing occurred.

## Backend contract

`resetPasswordService.resetPassword()` in `src/lib/reset-password-service.ts` receives exactly:

```typescript
{ token: string, newPassword: string }
```

Confirmation is frontend-only and never included. The default adapter returns `unconfigured`, makes no requests and cannot show success. Forms accept an injected adapter for tests and future integration. Map backend failures to `invalid_token`, `expired_token`, `rate_limited`, `network`, `server` or `validation`; sanitized `fieldErrors.newPassword` targets the password field. Thrown exceptions are reduced to safe network/server messages, not displayed or logged.

Needed before integration: endpoint and method; token encoding, verification and expiry rules; accepted payload/error shape; confirmation of password policy; reset-email URL generation; session invalidation policy. Existing sign-in, recovery, signup and OAuth adapters remain unconfigured. No guessed endpoint or provider SDK was added.

## Validation and security

- Required new password and confirmation; exact match.
- Existing signup policy reused: at least 8 characters, lowercase, uppercase, number and symbol. This is the existing frontend policy, not a confirmed backend policy.
- Missing/empty, duplicate and whitespace/control-character tokens are rejected. No JWT/hex format, minimum token length or client-inferred expiry is invented.
- Token parsing occurs after hydration from the browser query string, not in a server loader. No token or password is rendered as text, logged or written to browser storage. Password visibility is user-controlled.
- URL tokens naturally enter the initial page request and browser history. Infrastructure logging and third-party telemetry redaction need review when the real backend is connected; this frontend cannot guarantee external systems never record an incoming URL. The route sets a no-referrer hint, and a consumed token is removed after success.
- Passwords and an unconsumed token stay in volatile form/component memory only; no production auth session is simulated.

## Verification

- `bunx vitest run`: 5 files, 48 tests passed, including 20 reset tests and existing page/model tests.
- `bunx eslint src vite.config.ts vitest.config.ts eslint.config.js`: zero errors, six existing fast-refresh warnings in unchanged UI primitives.
- Latest automatic preview build/typecheck: `build OK`. A separate manual production build was not run because this environment performs builds automatically.
- Chromium: missing/malformed links, required/strength/confirmation validation, first-error focus, both visibility toggles, valid submit to the honest unconfigured message, recovery navigation, no new browser-storage writes and existing Login/Forgot Password/Sign Up rendering checked. No browser errors observed.
- Screenshots inspected at desktop 1280×1800, current preview 949×551, tablet 768×1024 and phone 390×844; no horizontal overflow. Reduced-motion phone rendering also checked.
- Pending, duplicate-submit, accepted success, password clearing, invalid/expired token and network/server failure behavior verified with injected test services. No live reset was possible without a backend contract; test success is not a production preview feature.

## Local commands

```bash
bun install
bun run dev
bun run test
bun run lint
bun run build
```

Use Vite’s printed localhost address and open `/reset-password` for missing-link handling, or `/reset-password?token=test-only-token` for the form’s unconfigured flow. No real token is needed to inspect the frontend.