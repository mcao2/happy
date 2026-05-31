# Agent Workflow

## Do Not Run `pnpm install` Blindly

The monorepo's `pnpm-lock.yaml` was produced by pnpm v9+ as a single document.
The current environment runs pnpm v8, which cannot parse that lockfile and falls
back to a full dependency resolution. The monorepo contains heavy packages
(React Native, Electron, Prisma), so a full install downloads ~2.4 GB+ and will
fill the disk.

**When working on `pi-happy` or `happy-agent`/`happy-wire` only:**
- Run `bash scripts/link-pi-happy-deps.sh` instead of `pnpm install`.
- This creates a minimal `node_modules` with symlinks to pre-installed external
  deps in `/tmp/pi-happy-deps` and workspace packages in `packages/`.
- Both `happy-agent` and `happy-wire` are pre-built (`dist/` checked in), so no
  build step is needed for pi-happy to function.

Only attempt a full `pnpm install` on a machine with >10 GB free and after
resolving the lockfile version mismatch (e.g. by upgrading pnpm or regenerating
`pnpm-lock.yaml` for pnpm v8).

## Sync To Main

When the user says `sync to main` or `synt to main`, they mean:

1. Fetch `origin/main`.
2. Rebase the current branch on `origin/main`.
3. Push the current HEAD directly to `main` with a normal push, for example:
   `git push origin HEAD:main`

Do not force push for this workflow.
