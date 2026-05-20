# CLAUDE.md

We're building the app described in @SPEC.md. Read that file for general architectural tasks or to double-check the exact database structure, tech stack or application architecture.

Keep your replies extremly concise and focus on converying the key information. No unnecessry fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensure that you're working with up-to-date information.
Use the DocExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev       # Start development server (http://localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
npx vitest        # Run all tests
npx vitest run path/to/test.ts   # Run a single test file
npx prisma migrate dev --name <name>   # Apply schema changes
npx prisma generate                    # Regenerate Prisma client
```

## Architecture

This is a full-stack note-taking app: authenticated users can create rich-text notes and optionally share them via a public link.

**Next.js 16 App Router** — use route groups `(auth)` for guest-only pages and `(app)` for protected pages. The spec is in `SPEC.md`.

**Prisma + SQLite**
- Schema: `prisma/schema.prisma`
- Client is generated to `app/generated/prisma` (non-standard output path — import from there, not `@prisma/client`)
- better-auth manages its four tables (`user`, `session`, `account`, `verification`); run `npx @better-auth/cli generate` to add them to the schema, then migrate

**better-auth**
- Server instance: `lib/auth.ts` (uses Prisma adapter)
- Browser client: `lib/auth-client.ts`
- Route protection via `middleware.ts` at project root — redirect unauthenticated requests to `/login`
- Auth API handler at `app/api/auth/[...all]/route.ts`

**TipTap editor**
- `NoteEditor.tsx` — editable, uses `StarterKit` + `CodeBlockLowlight`
- `ReadOnlyEditor.tsx` — `editable: false`, used on `/share/[shareToken]`
- Content persisted as `JSON.stringify(editor.getJSON())` in the `content` column; re-hydrated via `JSON.parse`

**Server Actions** (`actions/notes.ts`)
- `createNote`, `updateNote`, `deleteNote`, `toggleShare`
- Each action verifies the session user owns the target note before mutating

**Key env vars** (`.env.local`):
```
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=file:./data/notes.db
```
