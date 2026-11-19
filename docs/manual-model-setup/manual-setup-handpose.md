# Manual setup: HandPose

This guide shows how to run a HandPose sketch with model files stored beside your project.

## What you will end up with

```text
my-sketch/
  index.html
  sketch.js
  ml5-models/
    handpose/
      tfjs/
        detector/
          model.json
          group*.bin
        landmark/
          model.json
          group*.bin
      mediapipe/
        hands.binarypb
        hands.js
        hand_landmark_full.tflite
        ...
```

You do not need both `tfjs/` and `mediapipe/`. Pick one path below. In your sketch, point `modelPath` at the model root (`./ml5-models/handpose`), not at the `tfjs/` or `mediapipe/` subfolder.

## Pick a runtime

- **TFJS** is recommended if you are unsure. It is the default path and usually has fewer files to manage.
- **MediaPipe** uses more files, including `.wasm`, `.data`, `.binarypb`, and `.tflite` files. It can be a good choice if you specifically want the MediaPipe runtime.

```js
// TFJS, the default for local model roots
ml5.handPose({ modelPath: "./ml5-models/handpose" });

// MediaPipe, if you downloaded the mediapipe/ files
ml5.handPose({ runtime: "mediapipe", modelPath: "./ml5-models/handpose" });
```

## Path A: TFJS, recommended for beginners

Create these folders:

```text
ml5-models/handpose/tfjs/detector/
ml5-models/handpose/tfjs/landmark/
```

Download the two `model.json` files:

- [Detector model.json](https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1/model.json?tfjs-format=file) → save as `ml5-models/handpose/tfjs/detector/model.json`
- [Landmark model.json](https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/model.json?tfjs-format=file) → save as `ml5-models/handpose/tfjs/landmark/model.json`

Then open each `model.json` file in a text editor. Find `weightsManifest`, then download every `.bin` file listed in `paths`. Save each `.bin` file in the same folder as the `model.json` that mentioned it.

Use this in your sketch:

```js
ml5.handPose({ modelPath: "./ml5-models/handpose" });
```

## Path B: MediaPipe

Create this folder:

```text
ml5-models/handpose/mediapipe/
```

Download these shared files into that folder:

- [hands.binarypb](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.binarypb)
- [hands.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js)
- [hands_solution_packed_assets.data](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_packed_assets.data)
- [hands_solution_packed_assets_loader.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_packed_assets_loader.js)
- [hands_solution_simd_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_simd_wasm_bin.js)
- [hands_solution_simd_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_simd_wasm_bin.wasm)
- [hands_solution_simd_wasm_bin.data](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_simd_wasm_bin.data)
- [hands_solution_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_wasm_bin.js)
- [hands_solution_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_wasm_bin.wasm)

Then choose one landmark model:

- Smaller: [hand_landmark_lite.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hand_landmark_lite.tflite)
- Default/full: [hand_landmark_full.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hand_landmark_full.tflite)

You can also browse the files at [jsdelivr's `@mediapipe/hands` page](https://www.jsdelivr.com/package/npm/@mediapipe/hands).

Use this in your sketch:

```js
ml5.handPose({ runtime: "mediapipe", modelPath: "./ml5-models/handpose" });
```

## Run your sketch locally

Do not open `index.html` with `file://`. Use a local server.

The friendliest option for many beginners is the **Live Server** extension in VS Code. Open your sketch folder, click **Go Live**, then open the local URL it gives you.

Or, from your sketch folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Verify it loaded locally

Open DevTools → Network, reload, and check that model files load from `localhost`. They should not load from `cdn.jsdelivr.net`, `tfhub.dev`, or `storage.googleapis.com`.

## See also

- Example: [`../../examples/handPose-keypoints-offline-local-model-cli/`](../../examples/handPose-keypoints-offline-local-model-cli/)
- Full file reference: [`where-to-download-models.md`](./where-to-download-models.md)
- Troubleshooting: [`troubleshooting.md`](./troubleshooting.md)

## License note

MediaPipe assets are distributed by Google under Apache-2.0. TFJS model weights are distributed by Google through TFHub/Kaggle model hosting. Keep upstream attribution with projects that redistribute `ml5-models/`.
