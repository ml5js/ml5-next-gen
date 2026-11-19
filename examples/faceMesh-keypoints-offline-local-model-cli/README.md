# FaceMesh keypoints — offline (local model via CLI)

This example tracks facial landmarks from a webcam while loading FaceMesh model files from this folder instead of the network.

Run this once from this example folder:

```bash
node ../../bin/ml5.js cache prefetch facemesh
```

Once the CLI is published to npm, this becomes `npx ml5 cache prefetch facemesh`.

The command creates `./ml5-models/facemesh/` with local TFJS and MediaPipe files plus a `manifest.json` integrity file. The sketch uses:

```js
ml5.faceMesh({ ...options, modelPath: "./ml5-models/facemesh" });
```

Point `modelPath` at the model root (`./ml5-models/facemesh`), not at `tfjs/` or `mediapipe/`. This uses the local TFJS files by default. To force the local MediaPipe runtime instead, use:

```js
ml5.faceMesh({ ...options, runtime: "mediapipe", modelPath: "./ml5-models/facemesh" });
```

To verify offline loading, open DevTools → Network, reload, and confirm the model files come from `localhost` instead of `cdn.jsdelivr.net`, `tfhub.dev`, or `storage.googleapis.com`.

See also: [`../../docs/offline-mode.md`](../../docs/offline-mode.md) for advanced CLI flags, verification, and output directory options.
