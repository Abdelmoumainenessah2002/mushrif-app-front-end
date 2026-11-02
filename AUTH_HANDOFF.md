# Mushrif login and recovery handoff

## Delivered routes

- `/login`: email-or-phone validation, password visibility, in-memory Remember me preference, field errors, pending/duplicate-submit protection, general feedback, and Google/GitHub/Facebook entry points.
- `/forgot-password`: email validation, pending state, feedback, and return navigation.
- Both preserve the existing fonts, dark surfaces, saffron accent, Motion transitions, grid/grain effects, and wordmark. Desktop shows an illustrative product composition using existing demo data; tablet and mobile focus on the form.
- The homepage remains unchanged. Open the new pages directly; no homepage navigation was changed.

## Files created

| File | Purpose |
| --- | --- |
| `src/routes/login.tsx` | Public login route and unique head metadata |
| `src/routes/forgot-password.tsx` | Public recovery route and unique head metadata |
| `src/components/auth/AuthLayout.tsx` | Shared page composition, branding and product illustration |
| `src/components/auth/AuthForms.tsx` | Login/recovery forms, shared fields and loading button |
| `src/components/auth/AuthFeedback.tsx` | Accessible error and backend-gated success states |
| `src/components/auth/OAuthOptions.tsx` | Provider buttons and recognizable monochrome icons |
| `src/lib/auth-service.ts` | Validation schemas, service contracts, default unconfigured adapters, provider configuration, safe error messages |
| `src/hooks/use-auth-action.ts` | Shared idle/pending/result state and synchronous submission lock |
| `src/test/auth-state.test.tsx` | Eight focused validation, adapter, concurrency, preference, failure and success-state tests |
| `roadmap.md` | Task completion checklist |
| `AUTH_HANDOFF.md` | This handoff |

## Files modified

- `src/test/app-routing.test.tsx`: added matching checks for both new public routes.
- `src/test/setup.ts`: added a ResizeObserver test stub for the existing Radix checkbox.
- `AGENTS.md`: updated architecture rule to allow the new public pages and documented isolated service contracts.
- `src/routeTree.gen.ts`: regenerated automatically by the router; not manually edited.
- Project memory records the frontend-only boundary and future profile requirement; memory is not required for local runtime.

No files deleted. No homepage, backend, environment, dependency manifest or lockfile modifications.

## Dependencies

No new dependencies. Reused React, TanStack Router, Tailwind CSS, Motion for React, Lucide, React Hook Form, Zod, the existing Zod resolver, existing Button/Input/Checkbox primitives (including Radix), Vitest and Testing Library.

## Integration points

`src/lib/auth-service.ts` exports the centralized `authService` with `signIn`, `requestRecovery`, and `beginOAuth`. All default methods return `unconfigured`; they make no requests, send no emails, and create no sessions. Forms also accept an injected `AuthService` for isolated tests and future integration.

- `signIn` receives `{ identifier, password, rememberMe }`. Remember me exists only in component state and does not persist or promise session duration. Forward it only if the eventual backend supports it.
- Map real backend responses to `AuthResult`. Supported error categories: invalid credentials, invalid session, rate limiting, network failure, server failure and validation. Field errors can target identifier, password or email. Do not pass raw server errors to the UI.
- Only return login `success` after a genuine accepted authentication result. `LoginForm.onAuthenticated` is the explicit future Continue navigation hook; no nonexistent dashboard destination is configured. Without a hook, the accepted state offers return to the homepage.
- Only return recovery `success` after the backend accepts a recovery request. Its neutral confirmation avoids revealing account existence. The success state is covered by an injected test service, not exposed through a fake-success page control.
- `oauthProviders` controls provider visibility using `enabled`. No SDKs or arbitrary destinations exist. Replace `beginOAuth` with backend-controlled initiation later; do not treat initiation alone as completed authentication.
- No signup prompt/destination was added. No legal/support links were invented.
- User profiles are needed in a future phase; no storage or profile implementation was added now.

## Local commands

```bash
bun install
bun run dev
```

Use the localhost address printed by Vite, then visit `/login` or `/forgot-password`.

```bash
bun run test
bun run lint
bun run build
bun run preview
```

The full `bun run lint` invocation timed out in this sandbox while scanning the checkout. The bounded source check completed:

```bash
bunx eslint src vite.config.ts vitest.config.ts eslint.config.js
```

## Actual verification results

- Tests: 3 files, 17 tests passed (including the existing six model-data tests and homepage route match).
- Source/config lint: zero errors; six existing fast-refresh warnings in unchanged UI primitives. New files lint clean. Full-root lint timed out; not claimed as passed.
- Automatic preview build/typecheck: latest recorded result `build OK` after correcting optional-property types. A separate manual production build was not run in this environment; use the command above locally.
- Chromium: required fields, invalid email/phone formats, password visibility, checkbox state, default login rejection, all three unconfigured provider responses, recovery validation and no-email feedback, working login/recovery links, no localStorage entries, initial keyboard focus and homepage rendering verified; no page errors observed.
- Layout screenshots inspected at 1280px desktop, 768px tablet and 390px phone. No horizontal overflow on either new route at tablet or phone widths. Reduced-motion page rendering and keyboard focus checked; no exhaustive accessibility audit claimed.
- Loading/concurrent-submit protection, network/server categories and both backend-gated success states verified in tests using injected services, not a real backend.

## Boundaries and limitations

No actual authentication, session, email, OAuth, token, final reset-password or signup flow exists. No credentials are saved in browser storage. Real API contract, profile storage, session policy, provider support and post-login destination remain future work. No resend action was added before a backend cooldown contract exists. Illustration uses the existing invented Atlas demo data. Nothing was published, deployed, or configured for hosting/domains.