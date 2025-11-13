# Lendsqr FE Test — Clinton Atayero

Live: https://clinton-atayero-lendsqr-fe-test.vercel.app  
Repo: https://github.com/Clin-Tech/lendsqr-fe-test

## Stack & Rationale
- React + TypeScript: type-safe UI, reliable refactors.
- SCSS Modules: pixel-perfect fidelity, design tokens via variables, custom mixins for breakpoints.
- MSW (mock API): deterministic dev/test without network flakiness; 500 fake users from faker seed.
- Routing: react-router; shell layout + nested routes.
- State/Data: local component state + URL, simple hooks; no server state lib needed for mock scale.
- Caching (Requirement): **LocalStorage** on User Details for offline repeat loads.
- Testing: Vitest + RTL for rendering, sorting, caching.

## Architecture
- `/layout` AppShell, TopNav, Sidebar.
- `/pages/Login`, `/pages/UsersPage`, `/pages/Users` (details), `/pages/SectionPlaceholder`.
- `/mocks` MSW handlers + seeded data.
- `/styles` variables + breakpoints mixins; responsive grid and overflow decisions aligned to Figma.

## UX & Fidelity
- Typography: Work Sans (public). Avenir Next is proprietary → used **system stack fallback** pending confirmation.
- Components match spacing, colors, borders, icon sizes, hover states, and selection bars as in Figma.
- Tables: sticky header styles, responsive overflow-x, exact pagination labels.
- Details page: tabs are horizontally scrollable on small screens; actions aligned; KPI + pills colors match spec.

## Accessibility
- Semantic headings, aria-labels on interactive icons, `aria-current` on pagination.
- Keyboard: escape to close menus, visible focus for nav and rows.
- Color contrast checked against brand palette.

## Performance
- Vite build; code-split by route; images optimized; minimal re-renders (memoized slices).
- MSW only in dev; no runtime SW in prod bundle.

## Tests
- UsersPage renders, paginates, sorts.
- UserDetails cache test (LocalStorage-first).

## Tradeoffs
- Used LocalStorage instead of IndexedDB for simplicity (spec allows either).
- SCSS `@import` deprecation warnings kept (non-blocking); `@use` migration left as a follow-up to avoid risk close to deadline.

## How to Run
```bash
npm ci
npm run dev
npm run test
npm run build && npm run preview
