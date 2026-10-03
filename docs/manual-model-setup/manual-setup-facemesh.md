# Manual setup: FaceMesh

This guide shows how to run a FaceMesh sketch with model files stored beside your project.

## What you will end up with

```text
my-sketch/
  index.html
  sketch.js
  ml5-models/
    facemesh/
      tfjs/
        detector/
          model.json
          group*.bin
        landmark/
          model.json
          group*.bin
      mediapipe/
        face_mesh.binarypb
        face_mesh.js
        ...
```

You do not need both `tfjs/` and `mediapipe/`. Pick one path below. In your sketch, point `modelPath` at the model root (`./ml5-models/facemesh`), not at the `tfjs/` or `mediapipe/` subfolder.

## Pick a runtime

- **TFJS** is recommended if you are unsure.
- **MediaPipe** is useful if you specifically want FaceMesh's MediaPipe runtime. It has more files to download.

```js
// TFJS, the default for local model roots
ml5.faceMesh({ ...options, modelPath: "./ml5-models/facemesh" });

// MediaPipe, if you downloaded the mediapipe/ files
ml5.faceMesh({ ...options, runtime: "mediapipe", modelPath: "./ml5-models/facemesh" });
```

For a first manual setup, keep `refineLandmarks: false`. The refined landmarks option may require extra attention-model assets that are easier to manage with the CLI.

## Path A: TFJS, recommended for beginners

Create these folders:

```text
ml5-models/facemesh/tfjs/detector/
ml5-models/facemesh/tfjs/landmark/
```

Download the two `model.json` files:

- [Detector model.json](https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1/model.json?tfjs-format=file) → save as `ml5-models/facemesh/tfjs/detector/model.json`
- [Landmark model.json](https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1/model.json?tfjs-format=file) → save as `ml5-models/facemesh/tfjs/landmark/model.json`

Then open each `model.json` file in a text editor. Find `weightsManifest`, then download every `.bin` file listed in `paths`. Save each `.bin` file in the same folder as the `model.json` that mentioned it.

Use this in your sketch:

```js
ml5.faceMesh({ ...options, modelPath: "./ml5-models/facemesh" });
```

## Path B: MediaPipe

Create this folder:

```text
ml5-models/facemesh/mediapipe/
```

Download these files into that folder:

- [face_mesh.binarypb](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.binarypb)
- [face_mesh.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js)
- [face_mesh_solution_packed_assets.data](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_packed_assets.data)
- [face_mesh_solution_packed_assets_loader.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_packed_assets_loader.js)
- [face_mesh_solution_simd_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_simd_wasm_bin.js)
- [face_mesh_solution_simd_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_simd_wasm_bin.wasm)
- [face_mesh_solution_simd_wasm_bin.data](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_simd_wasm_bin.data)
- [face_mesh_solution_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_wasm_bin.js)
- [face_mesh_solution_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_wasm_bin.wasm)

You can also browse the files at [jsdelivr's `@mediapipe/face_mesh` page](https://www.jsdelivr.com/package/npm/@mediapipe/face_mesh).

Use this in your sketch:

```js
ml5.faceMesh({ ...options, runtime: "mediapipe", modelPath: "./ml5-models/facemesh" });
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

- Example: [`../../examples/faceMesh-keypoints-offline-local-model-cli/`](../../examples/faceMesh-keypoints-offline-local-model-cli/)
- Full file reference: [`where-to-download-models.md`](./where-to-download-models.md)
- Troubleshooting: [`troubleshooting.md`](./troubleshooting.md)

## License note

MediaPipe assets are distributed by Google under Apache-2.0. TFJS model weights are distributed by Google through TFHub/Kaggle model hosting. Keep upstream attribution with projects that redistribute `ml5-models/`.
