## Export Software Frontend

Built on top of [fe-zen-arch](git@github.com:shivamkj/fe-zen-arch.git) — the core shared architecture for B2B SaaS frontends.

### Libraries

- **React** [Docs](https://react.dev/reference/react)
- **Tailwind CSS** [Docs](https://tailwindcss.com/docs/installation)
- **React Query** [Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- **React Hook Form** [Docs](https://www.react-hook-form.com/get-started)
- **Zustand** [Docs](https://zustand.docs.pmnd.rs/)

### Setup

```bash
pnpm install   # fe-zen-arch is included as a git submodule, init it first if missing
pnpm dev       # dev server on port 5173
pnpm lint      # prettier + tsc + eslint (fe-zen-arch lint pipeline)
pnpm build     # production build
```

### Notes

- `core`, `ui`, `auth`, `icons` are fe-zen-arch workspace packages, aliased via tsconfig paths & vite aliases.
- Forms are built directly with `useForm` from `core/form` + `Form` / `SubmitButton` from `core/form/components` — no generic form templates.
- Routing uses fe-zen-arch's zustand router: routes defined in `src/shared/routes.tsx`, paths in `src/shared/route-paths.ts`.
- Auth uses the fe-zen-arch auth module (routes, interceptors, login pages) out of the box.
- API base URL comes from `PUBLIC_API_URL` (`.env`).
- Don't use react-query mutation for react-hook-form submit handler.
- For HMR (hot refresh), the file must export only react component, and not any other constant or object.
- While most input elements use `...register('name')`, custom elements like select require `<Select<T> name="name" />` instead.

---

## AI Usage & Approach

### Tools used
- **Claude Sonnet** (Anthropic) — architecture design, code generation, and refactoring

### How AI was used

**Analysis phase:** Used AI to map all direct `@/data/*` imports inside components and identify the two duplicate payload-transform functions (`toShippingBillPayload` in `model.ts` and `toHttpShippingBillPayload` in `shipping-bill-service.ts`).

**Architecture decisions:** Discussed with AI the right layering pattern — a `referenceService` that wraps static arrays behind Promise-based methods (with a mock delay) so every data fetch is API-ready without changing call sites to async/await today.

**Code generation:** AI generated the full bodies of:
- `src/shipping-bills/services/reference.service.ts` — async mock service for all lookup data
- `src/shipping-bills/hooks/use-form-options.ts` — React Query hook (staleTime: Infinity) consuming the service
- `src/shipping-bills/api/payload.ts` — canonical `toHttpPayload()` merging the two duplicates
- `src/shipping-bills/api/normalizers.ts` — API → form-values normalizers extracted from the service file
- `src/shipping-bills/api/flat-file.ts` — ICEGATE flat-file generator extracted from the service file

**Verification:** All generated code was reviewed for correctness of types, hook call-site placement (hooks called inside components, not at module scope), and that no new npm packages were introduced.

### What was written manually
- Route wiring and component integration review
- Final placement of `useFormOptions()` destructuring inside each consuming component (`BillEditor`, `InvoiceEditor`)
- Verification that `AsyncPartySelect` callbacks correctly call `referenceService` directly (async search path)

### Approach summary
The core constraint was *no new dependencies* and *no breaking changes to the form's behaviour*. The solution introduces a thin async indirection layer (`referenceService`) so the form never imports from `@/data/*` directly — all lookups go through a Promise — making the codebase swap-ready for real API endpoints with only a one-file change.
