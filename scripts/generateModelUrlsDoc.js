// scripts/generateModelUrlsDoc.js
//
// STATUS: Placeholder / not yet implemented.
//
// PURPOSE
// -------
// This script is intended to auto-generate `docs/model-urls.md` from the
// canonical model registry at `src/utils/modelRegistry.js`, so the human-
// readable URL reference cannot drift from the URLs ml5 actually requests
// at runtime.
//
// CURRENT STATE
// -------------
// `docs/model-urls.md` is hand-maintained today. Five TFJS URLs and the
// MediaPipe file-list pointer live there. If you change a URL in
// `src/utils/modelRegistry.js`, you must also update `docs/model-urls.md`
// by hand. This script does NOT yet enforce that — running it only prints
// a single line telling you where the docs live.
//
// WHY IT IS A STUB
// ----------------
// `src/utils/modelRegistry.js` uses ES module `export` syntax and is
// authored for the browser bundle (consumed by webpack). Importing it
// directly from a Node CLI script requires one of:
//   1. Renaming the registry to `.mjs` and adjusting webpack/jest config.
//   2. Adding a Babel/SWC transform step so this script can `require()` it.
//   3. Duplicating the URL data in a CommonJS file (rejected — that is
//      exactly the drift this script is meant to prevent).
// Option 1 or 2 was out of scope for the initial offline-mode PR (#305).
//
// TO IMPLEMENT
// ------------
// 1. Pick a transform strategy (recommend option 1: rename to `.mjs` and
//    update the two or three places that import it).
// 2. Import `TFJS_MODEL_URLS` and the MediaPipe file lists from the
//    registry.
// 3. Render a markdown document matching the current shape of
//    `docs/model-urls.md` (title, intro, link to manual-setup guide,
//    bulleted URL list, MediaPipe note).
// 4. Write the result to `docs/model-urls.md` (use `fs.writeFileSync`).
// 5. Add a `yarn docs:model-urls` script to `package.json` and wire it
//    into CI so a drift between registry and docs fails the build.
//
// RELATED FILES
// -------------
// - src/utils/modelRegistry.js  (source of truth: URLs + MediaPipe files)
// - docs/model-urls.md          (current hand-written output)
// - docs/manual-model-setup/where-to-download-models.md (beginner guide)
//
// See PR #305 for the offline-mode CLI that consumes the same registry.

console.log(
  "Model URL documentation lives in docs/model-urls.md and " +
    "src/utils/modelRegistry.js. This generator is a placeholder; " +
    "see the header comment in scripts/generateModelUrlsDoc.js for " +
    "implementation notes."
);
