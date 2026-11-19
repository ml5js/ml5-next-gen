# Offline mode

Use offline mode when a sketch needs to keep working on `localhost` without internet access, including after browser restarts.

New to local model files or prefer not to use the CLI? See the beginner-friendly [manual model setup guides](./manual-model-setup/README.md).

## Quick start

```bash
node bin/ml5.js cache prefetch handpose
```

Run this from the ml5-next-gen repo root. Once the CLI is published to npm, this becomes `npx ml5 cache prefetch handpose`.

Then point `modelPath` at the model root:

```js
let handPose = ml5.handPose({ modelPath: "./ml5-models/handpose" });
```

The CLI writes a per-runtime layout:

```text
ml5-models/handpose/
  manifest.json
  tfjs/
  mediapipe/
```

Point `modelPath` at the **model root**: the folder that contains `manifest.json`, such as `./ml5-models/handpose`. Do not point at a runtime subfolder like `./ml5-models/handpose/tfjs`.

When `modelPath` points at a prefetched model root, ml5 uses the TFJS files by default. To force MediaPipe:

```js
ml5.handPose({ runtime: "mediapipe", modelPath: "./ml5-models/handpose" });
```

Advanced: pointing directly at a leaf folder containing `model.json` only works for single-model TFJS layouts, such as BodyPose MoveNet. HandPose, FaceMesh, and BodyPose BlazePose have separate detector and landmark models, so they should use the model-root path.

## Examples

These examples show the local model CLI workflow end to end:

- `examples/handPose-keypoints-offline-local-model-cli/`
- `examples/faceMesh-keypoints-offline-local-model-cli/`
- `examples/bodyPose-keypoints-offline-local-model-cli/`

## CLI commands

```bash
node bin/ml5.js cache prefetch handpose facemesh bodypose
node bin/ml5.js cache prefetch bodypose --runtime mediapipe --variant full
node bin/ml5.js cache list
node bin/ml5.js cache verify handpose
node bin/ml5.js cache clear handpose
node bin/ml5.js cache models
```

`prefetch` downloads TFJS `model.json` files and shards, copies MediaPipe assets from ml5's installed dependencies, and records SHA-256 checksums in `manifest.json`.

## Known limitations

- Do not open sketches with `file://`; use a local web server.
- Strict Content Security Policy rules can block MediaPipe's script loading.
- p5.js Web Editor users cannot run the CLI, so they should keep using CDN loading or IndexedDB caching.

## Licensing

MediaPipe assets are distributed by Google under Apache-2.0. TFJS model weights are distributed by Google through TFHub/Kaggle model hosting. When redistributing a sketch with bundled `ml5-models/`, retain upstream license and attribution information.
