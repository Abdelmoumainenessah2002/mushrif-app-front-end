<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture

- The marketing homepage remains a single route (`src/routes/index.tsx`) composed of sections in `src/components/mushrif/`; public login and recovery routes extend it without changing homepage behavior.
- Authentication UI uses shared components and injectable browser-safe service contracts, defaulting to unconfigured results; keep future API integration separate from forms and never simulate production sessions.
- All demo data lives in `src/components/mushrif/data.ts` and must stay consistent with the real backend Mongoose models (enums, item keys like `ATLAS-12`); `src/test/mushrif-data.test.ts` guards this.
- Design tokens live only in `src/styles.css` (dark charcoal-green surfaces, saffron `--primary`, sage/sky/rose accents); components must use semantic tokens, never hardcoded colors.
- Registration lives in `src/lib/signup-service.ts` (schema, payload builder, unconfigured `RegistrationService`); forms never build payloads themselves, so the backend endpoint can be wired in one place.
