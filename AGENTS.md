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

- The landing page is a single route (`src/routes/index.tsx`) composed of section components in `src/components/mushrif/`; keep it a single marketing page — no app, dashboard, or auth routes.
- All demo data lives in `src/components/mushrif/data.ts` and must stay consistent with the real backend Mongoose models (enums, item keys like `ATLAS-12`); `src/test/mushrif-data.test.ts` guards this.
- Design tokens live only in `src/styles.css` (dark charcoal-green surfaces, saffron `--primary`, sage/sky/rose accents); components must use semantic tokens, never hardcoded colors.
