# TODO: Code Quality Improvements

## Markdown Implementation
- [x] **Type Safety**: Replace `any` types in `MarkdownRenderer.tsx` with proper types from `react-markdown` (`Components`).
- [x] **Performance**: Wrap `components` definition and `DOMPurify.sanitize` in `useMemo` in `MarkdownRenderer.tsx` to prevent unnecessary re-renders.
- [x] **Robustness**: Implement `AbortController` in `MDContainer.tsx` to handle race conditions during rapid navigation.
- [x] **Error Handling**: Add `.catch()` block to `fetch` in `MDContainer.tsx` to handle 404s or network errors gracefully with a UI alert.
- [x] **DOM Nesting**: Fixed `validateDOMNesting` warning by dynamically rendering `p` as `div` when it contains block elements (like code blocks).

## State Management & Performance
- [x] **Store Optimization**: In `useAppStore.ts`, ensure `selectTab` and `closeTab` remain as stable references.
- [x] **App Render Logic**: In `App.tsx`, move the `handleMouseDown` logic into a custom hook (`usePanelResize`) to clean up the main component.
- [x] **Theme Memoization**: The `theme` in `App.tsx` is memoized, and `colors` is derived stably via `useAppTheme`.

## UI/UX & Accessibility
- [x] **Accessibility**: Add missing `aria-label` or `aria-describedby` to the Sidebar icons and the resizer handle for better screen reader support.
- [x] **Responsive Design**: Verify that the `panelWidth` persistence doesn't cause layout issues (handled via `maxWidth: 50vw` and `usePanelResize` limits).
- [x] **DOM Nesting**: Fix box/grid nesting and stuff in the layout folder. We can also fix the height calculation using height 100% using the bucket concept.

## General
- [x] Review other staged changes for consistency and professional standards.
