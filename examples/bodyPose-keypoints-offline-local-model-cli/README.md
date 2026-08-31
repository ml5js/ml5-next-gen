# BodyPose keypoints — offline (local model via CLI)

This example tracks body keypoints from a webcam with the default BodyPose **MoveNet** model while loading model files from this folder instead of the network.

Run this once from this example folder:

```bash
node ../../bin/ml5.js cache prefetch bodypose
```

Once the CLI is published to npm, this becomes `npx ml5 cache prefetch bodypose`.

The command creates `./ml5-models/bodypose/` with local TFJS and MediaPipe files plus a `manifest.json` integrity file. The sketch uses:

```js
ml5.bodyPose({ modelPath: "./ml5-models/bodypose" });
```

Point `modelPath` at the model root (`./ml5-models/bodypose`), not at `tfjs/` or `mediapipe/`. This sketch uses MoveNet, which loads from the local TFJS files. If you only need this MoveNet sketch, use:

```bash
node ../../bin/ml5.js cache prefetch bodypose --runtime tfjs
```

To try the local BlazePose TFJS files instead, switch the sketch to:

```js
ml5.bodyPose({ modelName: "BlazePose", modelPath: "./ml5-models/bodypose" });
```

To force the local BlazePose MediaPipe runtime, use:

```js
ml5.bodyPose({ modelName: "BlazePose", runtime: "mediapipe", modelPath: "./ml5-models/bodypose" });
```

To verify offline loading, open DevTools → Network, reload, and confirm the model files come from `localhost` instead of `cdn.jsdelivr.net`, `tfhub.dev`, or `storage.googleapis.com`.

See also: [`../../docs/offline-mode.md`](../../docs/offline-mode.md) for advanced CLI flags, verification, and output directory options.
