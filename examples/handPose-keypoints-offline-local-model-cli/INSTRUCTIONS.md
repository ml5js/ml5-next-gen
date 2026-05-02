# Running this HandPose example offline

Follow these steps from this example folder.

## 1. Download the local model files

```bash
node ../../bin/ml5.js cache prefetch handpose
```

Once the CLI is published to npm, this becomes `npx ml5 cache prefetch handpose`.

This creates `./ml5-models/handpose/` next to `index.html`. The sketch loads those files with:

```js
ml5.handPose({ modelPath: "./ml5-models/handpose" });
```

Use the model root (`./ml5-models/handpose`), not the `tfjs/` or `mediapipe/` subfolder. This uses local TFJS files by default. To force local MediaPipe instead:

```js
ml5.handPose({ runtime: "mediapipe", modelPath: "./ml5-models/handpose" });
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

Don't want to use the terminal? See [`../../docs/manual-model-setup/manual-setup-handpose.md`](../../docs/manual-model-setup/manual-setup-handpose.md) for a fully manual walkthrough.
