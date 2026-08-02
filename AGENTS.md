# Project guidance

## Commands

- `npm run dev` starts the local app.
- `npm run lint` checks lint rules.
- `npm run format` formats the project with Prettier and sorts Tailwind classes.
- `npm run format:check` checks formatting without writing changes.
- `npm test` runs the Vitest suite once.
- `npm run test:watch` runs tests interactively.
- `npm run build` type-checks and creates a production build.

## TDD workflow

1. Write a focused test that describes the requested behavior.
2. Run it and confirm it fails for the intended reason.
3. Implement the smallest change that makes it pass.
4. Refactor only while the test suite remains green.
5. Before committing, run `npm run format:check`, `npm run lint`, `npm test`, and `npm run build`.

Use React Testing Library to test visible, accessible behavior. Prefer role- and label-based queries; do not assert implementation details, component internals, or CSS class names unless styling itself is the requirement.

## React and TypeScript practices

- Use function components and strict TypeScript types; avoid `any`.
- Start every component, hook, and utility module with a named `/* ... */` orientation block above its imports. Begin with the primary exported name, then explain its responsibility, important collaborators, and what belongs elsewhere. Make it useful for a future maintainer; do not narrate implementation details line by line.
- Keep components small and single-purpose. Extract a component when it owns a distinct visual region, interaction, or reusable behavior—not merely to reduce line count.
- A component should be easy to scan from its props to its rendered output. If it mixes several independent sections, deeply nested conditionals, or many unrelated event handlers, split it at the nearest meaningful UI boundary.
- Keep leaf and presentational components focused on rendering accessible UI from typed props. They may hold local, purely presentational state such as an expanded panel or input focus state.
- Keep state as local as possible and derive values during render when practical.
- Do not use `useEffect` for values that can be calculated during rendering. Use effects only to synchronize with external systems.
- Provide stable, descriptive names and accessible semantic HTML.
- Preserve keyboard access, visible focus states, headings in order, and meaningful alt text.
- Keep dependencies minimal and do not add a UI library without a clear need.

## UI and business logic boundaries

- Keep business rules, configuration transforms, calculations, and data-shaping logic out of JSX. Put pure logic in typed functions or domain modules so it can be reused and tested without rendering a component.
- Use custom hooks for stateful application behavior, external synchronization, and event orchestration. Hooks should expose a small UI-oriented API rather than making rendering components coordinate low-level details.
- Keep rendering components responsible for composition, accessibility, and wiring UI events to named callbacks. Avoid embedding multi-step workflows, complex state transitions, or mutation logic directly in event-handler expressions.
- Isolate external APIs, browser APIs, and persistence behind focused adapters or hooks. Do not scatter direct storage, network, or canvas calls throughout presentational components.
- Prefer passing typed data and intent-revealing callbacks across component boundaries over passing mutable objects or implementation details.
- When a behavior has meaningful rules independent of the UI, add focused unit tests for that logic; keep React Testing Library tests centered on user-visible behavior.
