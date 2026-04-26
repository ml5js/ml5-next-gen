# Where to download model files

This page lists the model files used by the manual setup guides. The links are intentionally explicit so you can see exactly what your sketch needs.

Tip: for linked files, you can click the link or right-click and choose **Save Link As...**. Make sure the saved filename matches the filename shown in the guide.

## TFJS models

TFJS models start with a `model.json` file. That JSON file lists one or more weight shard files, usually named something like `group1-shard1of1.bin`.

To download a TFJS model manually:

1. Open the `model.json` link below.
2. Save it as `model.json` in the folder shown.
3. Open the saved `model.json` in a text editor.
4. Find `weightsManifest`, then look for the `paths` list.
5. Download every `.bin` file listed in `paths` from the same folder URL as the `model.json`.

The `?tfjs-format=file` part is important for TFHub links. It asks TFHub for browser-friendly files instead of a webpage.

### HandPose TFJS

| Piece | Download `model.json` from | Put it here |
| --- | --- | --- |
| Detector | [handpose detector model.json](https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1/model.json?tfjs-format=file) | `ml5-models/handpose/tfjs/detector/model.json` |
| Landmark | [handpose landmark model.json](https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1/model.json?tfjs-format=file) | `ml5-models/handpose/tfjs/landmark/model.json` |

### FaceMesh TFJS

| Piece | Download `model.json` from | Put it here |
| --- | --- | --- |
| Detector | [face detection model.json](https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1/model.json?tfjs-format=file) | `ml5-models/facemesh/tfjs/detector/model.json` |
| Landmark | [face mesh landmark model.json](https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1/model.json?tfjs-format=file) | `ml5-models/facemesh/tfjs/landmark/model.json` |

### BodyPose TFJS

| Piece | Download `model.json` from | Put it here |
| --- | --- | --- |
| MoveNet | [MoveNet multipose lightning model.json](https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1/model.json?tfjs-format=file) | `ml5-models/bodypose/tfjs/model/model.json` |
| BlazePose detector | [BlazePose detector model.json](https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/detector/1/model.json?tfjs-format=file) | `ml5-models/bodypose/tfjs/detector/model.json` |
| BlazePose landmark | [BlazePose landmark model.json](https://tfhub.dev/mediapipe/tfjs-model/blazepose_3d/landmark/full/2/model.json?tfjs-format=file) | `ml5-models/bodypose/tfjs/landmark/model.json` |

## MediaPipe versions

These docs were written against the MediaPipe package versions currently installed by this repository:

| Model | Package | Version snapshot | npm page |
| --- | --- | --- | --- |
| HandPose | `@mediapipe/hands` | `0.4.1675469240` | [npm](https://www.npmjs.com/package/@mediapipe/hands) |
| FaceMesh | `@mediapipe/face_mesh` | `0.4.1633559619` | [npm](https://www.npmjs.com/package/@mediapipe/face_mesh) |
| BodyPose / BlazePose | `@mediapipe/pose` | `0.5.1675469404` | [npm](https://www.npmjs.com/package/@mediapipe/pose) |

For best compatibility with ml5, use the versions listed in ml5's `package.json`. You can also check npm for newer versions, but newer files may not always match the version of ml5 you are using.

The bare CDN pattern is:

```text
https://cdn.jsdelivr.net/npm/@mediapipe/<package>@<version>/<file>
```

You can also use the jsdelivr file browser:

- [Browse `@mediapipe/hands`](https://www.jsdelivr.com/package/npm/@mediapipe/hands)
- [Browse `@mediapipe/face_mesh`](https://www.jsdelivr.com/package/npm/@mediapipe/face_mesh)
- [Browse `@mediapipe/pose`](https://www.jsdelivr.com/package/npm/@mediapipe/pose)

## HandPose MediaPipe files

Put these files in `ml5-models/handpose/mediapipe/`.

Shared files:

- [hands.binarypb](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.binarypb)
- [hands.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands.js)
- [hands_solution_packed_assets.data](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_packed_assets.data)
- [hands_solution_packed_assets_loader.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_packed_assets_loader.js)
- [hands_solution_simd_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_simd_wasm_bin.js)
- [hands_solution_simd_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_simd_wasm_bin.wasm)
- [hands_solution_simd_wasm_bin.data](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_simd_wasm_bin.data)
- [hands_solution_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_wasm_bin.js)
- [hands_solution_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hands_solution_wasm_bin.wasm)

Choose one landmark model:

- Lite, smaller and usually faster: [hand_landmark_lite.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hand_landmark_lite.tflite)
- Full, larger and usually more accurate: [hand_landmark_full.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/hand_landmark_full.tflite)

## FaceMesh MediaPipe files

Put these files in `ml5-models/facemesh/mediapipe/`.

- [face_mesh.binarypb](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.binarypb)
- [face_mesh.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh.js)
- [face_mesh_solution_packed_assets.data](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_packed_assets.data)
- [face_mesh_solution_packed_assets_loader.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_packed_assets_loader.js)
- [face_mesh_solution_simd_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_simd_wasm_bin.js)
- [face_mesh_solution_simd_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_simd_wasm_bin.wasm)
- [face_mesh_solution_simd_wasm_bin.data](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_simd_wasm_bin.data)
- [face_mesh_solution_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_wasm_bin.js)
- [face_mesh_solution_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/face_mesh_solution_wasm_bin.wasm)

## BodyPose BlazePose MediaPipe files

Put these files in `ml5-models/bodypose/mediapipe/`.

Shared files:

- [pose_web.binarypb](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_web.binarypb)
- [pose.js](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js)
- [pose_solution_packed_assets.data](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_packed_assets.data)
- [pose_solution_packed_assets_loader.js](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_packed_assets_loader.js)
- [pose_solution_simd_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_simd_wasm_bin.js)
- [pose_solution_simd_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_simd_wasm_bin.wasm)
- [pose_solution_simd_wasm_bin.data](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_simd_wasm_bin.data)
- [pose_solution_wasm_bin.js](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_wasm_bin.js)
- [pose_solution_wasm_bin.wasm](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_solution_wasm_bin.wasm)

Choose one landmark model:

- Lite, smaller and usually faster: [pose_landmark_lite.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_landmark_lite.tflite)
- Full, balanced default: [pose_landmark_full.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_landmark_full.tflite)
- Heavy, largest and usually most accurate: [pose_landmark_heavy.tflite](https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose_landmark_heavy.tflite)

## Licensing and attribution

MediaPipe assets are distributed by Google under Apache-2.0. TFJS model weights are distributed by Google through TFHub/Kaggle model hosting. When you share a project with bundled `ml5-models/`, keep upstream license and attribution information with your project.
