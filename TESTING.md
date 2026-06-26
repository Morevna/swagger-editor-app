# Testing

## Tools

- **Vitest + RTL** - unit and component tests (`*.test.tsx`), co-located with source files
- **Playwright** - E2E tests (`*.spec.ts`), in `/e2e/`

## Running tests

```bash
npm run test          # Vitest (watch mode)
npm run test:run      # Vitest (single run)
npm run test:ui       # Vitest with results in the browser
npm run test:e2e      # Playwright
npm run test:e2e:ui"  # Playwright (headed), can be useful for debugging
```

## Conventions

- Test files live next to the component they test: `LanguageSwitcher.tsx` - `LanguageSwitcher.test.tsx`
- Components that only render props with no logic don't need a unit test - cover them via a parent integration test
- Shared test utilities and mocks go in `src/test-utils/`
- Tests are written alongside the feature, not after

## Mocking

App Router hooks (`useRouter`, `usePathname`, `useSearchParams`) require `vi.mock` - see `LanguageSwitcher.test.tsx` for example

## Coverage

Target: **80% statements, 50% branches, 50% functions, 50% lines**.
Run with:

```bash
npm run test:coverage
```

Coverage report is generated in `/coverage`.

## E2E

- One file per feature: `locale.spec.ts`, `smoke.spec.ts`, etc.
- `baseURL` is `http://localhost:3000` - Playwright starts the dev server automatically via `webServer` config
- Run headed locally for debugging: `npx playwright test --ui`
