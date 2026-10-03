# HandPose keypoints — offline (local model via CLI)

Run this once from this example folder:

```bash
node ../../bin/ml5.js cache prefetch handpose
```

Once the CLI is published to npm, this becomes `npx ml5 cache prefetch handpose`.

The command creates `./ml5-models/handpose/` with local TFJS and MediaPipe files plus a `manifest.json` integrity file. The sketch uses:

```js
ml5.handPose({ modelPath: "./ml5-models/handpose" });
```

Point `modelPath` at the model root (`./ml5-models/handpose`), not at `tfjs/` or `mediapipe/`. This uses the local TFJS files by default. To force the local MediaPipe runtime instead, use:

```js
ml5.handPose({ runtime: "mediapipe", modelPath: "./ml5-models/handpose" });
```

To verify offline loading, open DevTools → Network, reload, and confirm the model files come from `localhost` instead of `cdn.jsdelivr.net`, `tfhub.dev`, or `storage.googleapis.com`.

See also: [`../../docs/offline-mode.md`](../../docs/offline-mode.md) for advanced CLI flags, verification, and output directory options.
