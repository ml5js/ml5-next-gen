# Manual model setup for offline sketches

Normally, ml5 downloads model files from the internet when your sketch starts. These guides show how to download those files yourself, put them next to your sketch, and use `modelPath` so your project can keep working without WiFi.

> **💡 If you can run Node, prefer the CLI.**
> `npx ml5 cache prefetch <model>` (today: `node bin/ml5.js cache prefetch <model>`) does all of this for you and produces a verifiable manifest. These manual instructions exist as a fallback for environments where Node is not available — see [`../offline-mode.md`](../offline-mode.md) for the recommended path.

This is the slower, more hands-on path. If you are comfortable using a terminal, the CLI guide in [`../offline-mode.md`](../offline-mode.md) is usually easier.

## Which guide should I use?

| If this sounds like you... | Start here |
| --- | --- |
| I want the easiest setup and I can use a terminal. | [`../offline-mode.md`](../offline-mode.md) |
| I do not want to use a terminal, or I want to understand every file. | One of the manual guides below. |
| I am using the p5.js Web Editor. | Local bundled files are not a good fit there — use normal CDN loading, or browser caching when available. |

## Pick your model

- [HandPose manual setup](./manual-setup-handpose.md)
- [FaceMesh manual setup](./manual-setup-facemesh.md)
- [BodyPose manual setup](./manual-setup-bodypose.md)

## Reference pages

- [Where to download every model file](./where-to-download-models.md)
- [Troubleshooting](./troubleshooting.md)

## A few helpful words

- **Model**: the files that contain the learned machine learning behavior.
- **Runtime**: the tool that runs the model in the browser. These guides cover **TFJS** and **MediaPipe**.
- **TFJS**: TensorFlow.js. This is the default path for many ml5 models.
- **MediaPipe**: Google's browser-ready solution files. These usually include `.js`, `.wasm`, `.data`, `.binarypb`, and `.tflite` files.
- **Shard**: a `.bin` file that stores part of a TFJS model's weights. A `model.json` file tells the browser which shard files it needs.
- **`modelPath`**: the ml5 option that tells a model where your local files are.
