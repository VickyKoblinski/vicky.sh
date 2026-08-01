# Project guidance

## Commands

- `npm run dev` starts the local app.
- `npm run lint` checks lint rules.
- `npm test` runs the Vitest suite once.
- `npm run test:watch` runs tests interactively.
- `npm run build` type-checks and creates a production build.

## TDD workflow

1. Write a focused test that describes the requested behavior.
2. Run it and confirm it fails for the intended reason.
3. Implement the smallest change that makes it pass.
4. Refactor only while the test suite remains green.
5. Before committing, run `npm run lint`, `npm test`, and `npm run build`.

Use React Testing Library to test visible, accessible behavior. Prefer role- and label-based queries; do not assert implementation details, component internals, or CSS class names unless styling itself is the requirement.

## React and TypeScript practices

- Use function components and strict TypeScript types; avoid `any`.
- Keep components small and single-purpose. Extract a component only when it improves clarity or reuse.
- Keep state as local as possible and derive values during render when practical.
- Do not use `useEffect` for values that can be calculated during rendering. Use effects only to synchronize with external systems.
- Provide stable, descriptive names and accessible semantic HTML.
- Preserve keyboard access, visible focus states, headings in order, and meaningful alt text.
- Keep dependencies minimal and do not add a UI library without a clear need.
