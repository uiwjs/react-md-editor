# Next.js App Router example

Run `npm install` from the repository root, then `npm run dev --workspace nextjs`

The page shows a JavaScript code block in the live preview, with syntax highlighting from `@uiw/react-markdown-preview`

The global editor and preview styles are imported by `src/app/layout.tsx`, not by the client component

The editor in `src/app/page.tsx` uses `next/dynamic` with `ssr: false` because the editor needs browser APIs

This example uses Webpack for `next dev`; earlier Turbopack versions could leave syntax highlighting unstyled (see [#682](https://github.com/uiwjs/react-md-editor/issues/682))
