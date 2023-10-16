# Alpha Release Reference

This is a temporary API reference for the next generation ml5 library. The project is currently under development and not stable, and final API will likely be different from the current version. Please feel free to reach out to us if you have any questions.

---

## ml5.bodyPix

### Description

As written by the developers of BodyPix:

"Bodypix is an open-source machine learning model which allows for person and body-part segmentation in the browser with TensorFlow.js. In computer vision, image segmentation refers to the technique of grouping pixels in an image into semantic areas typically to locate objects and boundaries. The BodyPix model is trained to do this for a person and twenty-four body parts (parts such as the left hand, front right lower leg, or back torso). In other words, BodyPix can classify the pixels of an image into two categories: 1. pixels that represent a person and 2. pixels that represent background. It can further classify pixels representing a person into any one of twenty-four body parts."

### Methods

#### ml5.bodyPix()

This method is used to initialize the bodyPix object.

```javascript
const bodyPix = ml5.bodyPix(?video, ?options, ?callback);
```

**Parameters:**

- **video**: OPTIONAL. An HTMLVideoElement or p5.Video to run the segmentation on.

- **options**: OPTIONAL. An object to change the default configuration of the model. The default and available options are:

  ```javascript
  {
    architecture: "ResNet50", // "MobileNetV1" or "ResNet50"
    multiplier: 1, // 0.5, 0.75 or 1
    outputStride: 16, // 8, 16, or 32
    quantBytes: 2, //1, 2 or 4
  }
  ```

  More info on options [here](https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/body_pix#create-a-detector).

- **callback(bodyPix, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.bodyPix()` within the p5 `preload` function.

**Returns:**  
The bodyPix object.

#### bodyPix.segment()

This method allows you to run segmentation on an image.

```javascript
bodyPix.segment(?input, callback);
```

**Parameters:**

- **input**: HTMLImageElement, HTMLVideoElement, ImageData, or HTMLCanvasElement. NOTE: Videos can be added through `ml5.bodyPix`.

- **callback(output, error)**: A function to handle the output of `bodyPix.segment()`. Likely a function to do something with the segmented image. See below for the output passed into the callback function:

  ```javascript
  {
    backgroundMask,
    bodyParts,
    partMask,
    personMask,
    raw: { backgroundMask, partMask, personMask },
    segmentation: [{ mask, maskValueToLabel}, ...],
  }
  ```

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.bodypose

### Description

Bodypose can be used for real-time human pose Estimation.

### Methods

#### ml5.bodypose()

This method is used to initialize the bodypose object.

```javascript
const bodypose = ml5.bodypose(?modelName, ?options, ?callback);
```

**Parameters:**

- **modelName**: OPTIONAL: A string specifying which model to use, "BlazePose" or "MoveNet". MoveNet is an ultra fast and accurate model that detects 17 keypoints of a body. BlazePose can detect 33 keypoints and provides 3D tracking.
- **options**: OPTIONAL. An object to change the default configuration of the model. The default and available options for MoveNet model are:

  ```javascript
  {
    modelType: "MULTIPOSE_LIGHTNING" // "MULTIPOSE_LIGHTNING", "SINGLEPOSE_LIGHTNING", or "SINGLEPOSE_THUNDE"
    enableSmoothing: true,
    minPoseScore: 0.25,
    multiPoseMaxDimension: 256,
    enableTracking: true,
    trackerType: "boundingBox", // "keypoint" or "boundingBox"
    trackerConfig: {},
    modelUrl: undefined,
  }
  ```

  More info on options for MoveNet [here](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/movenet#create-a-detector).

  The default and available options for BlazePose model are:

  ```javascript
  {
    runtime: "mediapipe" // "mediapipe" or "tfjs"
    enableSmoothing: true,
    modelType: "full", // "lite", "full", or "heavy"
    detectorModelUrl: undefined, //default to use the tf.hub model
    landmarkModelUrl: undefined, //default to use the tf.hub model
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
  }
  ```

  More info on options for MediaPipe BlazePose [here](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe) and for TFJS BlazePose [here](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs#create-a-detector).

- **callback(bodypose, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.bodyPix()` within the p5 `preload` function.

**Returns:**  
The bodypose object.

#### bodypose.detectStart()

This method repeatedly outputs pose estimations on an image media through a callback function.

```javascript
bodypose.detectStart(media, callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: A callback function to handle the output of the estimation. See below for an example output passed into the callback function:

  ```javascript
  [
    {
      box: { width, height, xMax, xMin, yMax, yMin },
      id: 1,
      keypoints: [{ x, y, score, name }, ...],
      left_ankle: { x, y, confidence },
      left_ear: { x, y, confidence },
      left_elbow: { x, y, confidence },
      ...
      score: 0.28,
    },
    ...
  ];
  ```

  See the diagram below for the position of each keypoint.

  ![Keypoint Diagram](https://camo.githubusercontent.com/b8a385301ca6b034d5f4807505e528b4512a0aa78507dec9ebafcc829b9556be/68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f6d6f76656e65742f636f636f2d6b6579706f696e74732d3530302e706e67)

#### bodypose.detectStop()

This method can be called after a call to `bodypose.detectStart` to stop the repeating pose estimation.

```javascript
bodypose.detectStop();
```

#### bodypose.detect()

This method asynchronously outputs a single pose estimation on an image media when called.

```javascript
bodypose.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the estimation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.facemesh

### Description

Facemesh can be used for real-time face landmark Estimation.

### Methods

#### ml5.facemesh()

This method is used to initialize the facemesh object.

```javascript
const facemesh = ml5.facemesh(?options, ?callback);
```

**Parameters:**

- **options**: OPTIONAL. An object to change the default configuration of the model. The default and available options are:

  ```javascript
  {
      maxFaces: 1,
      refineLandmarks: false,
      flipHorizontal: false
  }
  ```

  More info on options [here](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection/src/mediapipe#create-a-detector).

- **callback(facemesh, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.facemesh()` within the p5 `preload` function.

**Returns:**  
The facemesh object.

#### facemesh.detectStart()

This method repeatedly outputs face estimations on an image media through a callback function.

```javascript
facemesh.detectStart(media, callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: A callback function to handle the output of the estimation. See below for an example output passed into the callback function:

  ```javascript
  [
    {
      box: { width, height, xMax, xMin, yMax, yMin },
      keypoints: [{x, y, z, name}, ... ],
      faceOval: [{x, y, z}, ...],
      leftEye: [{x, y, z}, ...],
      ...
    },
    ...
  ]
  ```

  [Here](https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg) is a diagram for the position of each keypoint (download and zoom in to see the index).

#### facemesh.detectStop()

This method can be called after a call to `facemesh.detectStart` to stop the repeating face estimation.

```javascript
facemesh.detectStop();
```

#### facemesh.detect()

This method asynchronously outputs a single face estimation on an image media when called.

```javascript
facemesh.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the estimation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.handpose

### Description

Handpose can be used for real-time hand Estimation.

### Methods

#### ml5.handpose()

This method is used to initialize the handpose object.

```javascript
const handpose = ml5.handpose(?options, ?callback);
```

**Parameters:**

- **options**: OPTIONAL. An object to change the default configuration of the model. The default and available options are:

  ```javascript
  {
    maxHands: 2,
    runtime: "mediapipe",
    modelType: "full",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    detectorModelUrl: undefined, //default to use the tf.hub model
    landmarkModelUrl: undefined, //default to use the tf.hub model
  }
  ```

  More info on options [here](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection/src/mediapipe#create-a-detector) for "mediapipe" runtime.
  More info on options [here](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection/src/tfjs#create-a-detector) for "tfjs" runtime.

- **callback(handpose, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.handpose()` within the p5 `preload` function.

**Returns:**  
The handpose object.

#### handpose.detectStart()

This method repeatedly outputs hand estimations on an image media through a callback function.

```javascript
handpose.detectStart(media, callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: A callback function to handle the output of the estimation. See below for an example output passed into the callback function:

  ```javascript
  [
    {
      score,
      handedness,
      keypoints: [{ x, y, score, name }, ...],
      keypoints3D: [{ x, y, z, score, name }, ...],
      index_finger_dip: { x, y, x3D, y3D, z3D },
      index_finger_mcp: { x, y, x3D, y3D, z3D },
      ...
    }
    ...
  ]
  ```

  See the diagram below for the position of each keypoint.

  ![Keypoint Diagram](https://camo.githubusercontent.com/b0f077393b25552492ef5dd7cd9fd13f386e8bb480fa4ed94ce42ede812066a1/68747470733a2f2f6d65646961706970652e6465762f696d616765732f6d6f62696c652f68616e645f6c616e646d61726b732e706e67)

#### handpose.detectStop()

This method can be called after a call to `handpose.detectStart` to stop the repeating hand estimation.

```javascript
handpose.detectStop();
```

#### handpose.detect()

This method asynchronously outputs a single hand estimation on an image media when called.

```javascript
handpose.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the estimation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.neuralNetwork

See [old reference](https://learn.ml5js.org/#/reference/neural-network) and Nature of Code [Chapter 10: Neural Networks](https://nature-of-code-2nd-edition.netlify.app/neural-networks/) and [Chapter 11: Neuroevolution](https://nature-of-code-2nd-edition.netlify.app/neuroevolution/)

---

## ml5.sentiment

See [old reference](https://learn.ml5js.org/#/reference/sentiment).

---

More models and features coming soon!
