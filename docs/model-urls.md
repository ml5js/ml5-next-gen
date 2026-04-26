# Model URL reference

This file is the human-readable companion to `src/utils/modelRegistry.js`.

For a beginner-friendly walkthrough with manual download instructions, see [`manual-model-setup/where-to-download-models.md`](./manual-model-setup/where-to-download-models.md).

- HandPose TFJS detector: `https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/detector/full/1`
- HandPose TFJS landmark: `https://tfhub.dev/mediapipe/tfjs-model/handpose_3d/landmark/full/1`
- FaceMesh TFJS detector: `https://tfhub.dev/mediapipe/tfjs-model/face_detection/short/1`
- FaceMesh TFJS landmark: `https://tfhub.dev/mediapipe/tfjs-model/face_landmarks_detection/face_mesh/1`
- BodyPose MoveNet TFJS: `https://tfhub.dev/google/tfjs-model/movenet/multipose/lightning/1`

MediaPipe files are copied from the installed `@mediapipe/hands`, `@mediapipe/face_mesh`, and `@mediapipe/pose` packages. The concrete file lists live in `src/utils/modelRegistry.js`.
