# Running this BodyPose example offline

Follow these steps from this example folder.

## 1. Download the local model files

This example uses BodyPose with the default MoveNet model. To download only the TFJS files needed by this sketch, run:

```bash
node ../../bin/ml5.js cache prefetch bodypose --runtime tfjs
```

Once the CLI is published to npm, this becomes `npx ml5 cache prefetch bodypose --runtime tfjs`.

If you want both MoveNet and BlazePose files available locally, run:

```bash
node ../../bin/ml5.js cache prefetch bodypose
```

Once the CLI is published to npm, this becomes `npx ml5 cache prefetch bodypose`.

This creates `./ml5-models/bodypose/` next to `index.html`. The sketch loads MoveNet with:

```js
ml5.bodyPose({ modelPath: "./ml5-models/bodypose" });
```

Use the model root (`./ml5-models/bodypose`), not the `tfjs/` or `mediapipe/` subfolder. To use local BlazePose TFJS instead of MoveNet:

```js
ml5.bodyPose({ modelName: "BlazePose", modelPath: "./ml5-models/bodypose" });
```

To force local BlazePose MediaPipe:

```js
ml5.bodyPose({ modelName: "BlazePose", runtime: "mediapipe", modelPath: "./ml5-models/bodypose" });
```

## 2. Start a local web server

Do not open `index.html` with `file://`. From this folder, run one of:

```bash
python3 -m http.server 8000
```

or:

```bash
bunx serve .
```

Then open `http://localhost:8000` or the URL printed by `serve`.

## 3. Verify it is loading locally

Open DevTools → Network, reload the page, and confirm model files load from `localhost`, not from `cdn.jsdelivr.net`, `tfhub.dev`, or `storage.googleapis.com`.

For more options, see [`../../docs/offline-mode.md`](../../docs/offline-mode.md).

Don't want to use the terminal? See [`../../docs/manual-model-setup/manual-setup-bodypose.md`](../../docs/manual-model-setup/manual-setup-bodypose.md) for a fully manual walkthrough.
