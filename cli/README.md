# ml5 cache CLI internals

This directory contains the Node source for the `ml5 cache ...` command group.
For user-facing instructions, start with [`../docs/offline-mode.md`](../docs/offline-mode.md).

## Entry flow

```text
bin/ml5.js   shebang executable; forwards process.argv to ../cli/index.js
cli/index.js top-level dispatcher for cache prefetch | list | clear | verify | models
```

`bin/ml5.js` is the published executable declared in `package.json#bin`. The
dispatcher currently accepts only the `cache` group, leaving room for future
non-cache CLI commands without changing the subcommand modules.

## Subcommand modules

- `prefetch.js` downloads/copies model assets and writes `manifest.json`.
- `list.js` enumerates cached model folders from `<out>`.
- `clear.js` removes one model cache folder, or the entire cache folder.
- `verify.js` re-hashes cached files and reports manifest mismatches.
- `models.js` prints the registered models and MediaPipe variants.

## Shared modules

- `registry.js` mirrors the runtime registry for Node/CommonJS use.
- `utils/paths.js` resolves `--out` and builds model/runtime subdirectories.
- `utils/manifest.js` reads, writes, and verifies cache manifests.
- `utils/sha.js` streams files through SHA-256 hashing.
- `utils/copy-mediapipe.js` copies MediaPipe assets from `node_modules`.
- `utils/download-tfjs.js` downloads TFJS `model.json` files and shards.
- `utils/progress.js` centralizes quiet-aware progress logging.
- `utils/size.js` formats byte counts for human-readable output.

## Key design decisions

- The default `prefetch` runtime is `both`, so the command prompts before
  staging large downloads and requires `--yes` in non-interactive shells.
- The SHA-256 manifest is the on-disk contract that
  `src/utils/modelResolver.js` probes when a sketch uses `modelPath`.
- MediaPipe filenames are hardcoded because package layouts are stable; package
  versions are read at runtime from each installed `@mediapipe/*` package.
- TFJS shard filenames are not hardcoded. They are discovered from each
  downloaded `model.json` file's `weightsManifest`.

## Registry duplication

`cli/registry.js` is a CommonJS mirror of `src/utils/modelRegistry.js` (ESM).
They must be kept in sync by hand for v1.

**Why duplicated:** the CLI is invoked via `bin/ml5.js` as plain Node CommonJS
with no build step. Importing the ESM runtime registry directly would require
either an ESM CLI entry point, which raises the floor for contributors, or a
build step that runs before `bin/ml5.js` is usable from a checkout, which breaks
`node bin/ml5.js` ergonomics.

**How to keep them in sync:**

1. When you add or change a model URL or file list in
   `src/utils/modelRegistry.js`, mirror the change in `cli/registry.js` in the
   same commit.
2. Run `node bin/ml5.js cache prefetch <model>` followed by
   `node bin/ml5.js cache verify <model>` to confirm the CLI side resolves
   correctly.

**Planned follow-up (not in this PR):**

- Add a registry-drift unit test that diffs the two registries and fails CI on
  mismatch.
- Either generate `cli/registry.js` at build time from the runtime registry, or
  extract the shared data into a plain `.json` file consumed by both.

## Known follow-ups

- `clear.js` and `verify.js` use lightweight positional parsing. Replace them
  with a shared parser before adding more flags.
- `copy-mediapipe.js` re-hashes every copied/reused file on each run. Cache hash
  results if that becomes slow for larger model sets.
- `registry.js` intentionally mirrors `src/utils/modelRegistry.js` until the
  project has a shared source format or generator that works in Node and the
  browser bundle.

## See also

- [`../src/utils/modelResolver.js`](../src/utils/modelResolver.js) — runtime
  consumer of `<out>/<model>/manifest.json`.
- [`../src/utils/modelRegistry.js`](../src/utils/modelRegistry.js) — canonical
  runtime URL/file-list source.
- [`../CONTRIBUTING.md`](../CONTRIBUTING.md) — see "Updating offline model
  files" for the contributor checklist.
