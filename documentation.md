# Alpha Release Reference

This is a temporary API reference for the next generation ml5 library version `0.20.0-alpha.4`. The project is currently under development and not stable, and final API will likely be different from the current version. Please feel free to reach out to us if you have any questions.

You can access the library by including the following script tag in your HTML file:

```html
<script src="https://unpkg.com/ml5@0.20.0-alpha.4/dist/ml5.min.js"></script>
```

---

## ml5.bodySegmentation

### Description

BodySegmentation divides an image input into the people and the background.

### Methods

#### ml5.bodySegmentation()

This method is used to initialize the bodySegmentation object.

```javascript
const bodySegmentation = ml5.bodySegmentation(?modelName, ?options, ?callback);
```

**Parameters:**

- **modelName**: OPTIONAL: A string specifying which model to use, "SelfieSegmentation" or "BodyPix".

- **options**: OPTIONAL. An object to change the default configuration of the model. See the example options object:

  ```javascript
  {
    runtime: "mediapipe", // "mediapipe" or "tfjs"
    modelType: "general", // "general" or "landscape"
    maskType: "background", //"background", "body", or "parts" (used to change the type of segmentation mask output)
  }
  ```

  [More info on options for SelfieSegmentation model with mediaPipe runtime](https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/selfie_segmentation_mediapipe#create-a-detector).

  [More info on options for SelfieSegmentation model with tfjs runtime](https://github.com/tensorflow/tfjs-models/tree/master/body-segmentation/src/selfie_segmentation_tfjs#create-a-detector).

  [More infor on options for BodyPix model.](https://github.com/tensorflow/tfjs-models/blob/master/body-segmentation/src/body_pix/README.md#create-a-detector)

- **callback(bodySegmentation, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.bodySegmentation()` within the p5 `preload` function.

**Returns:**  
The bodySegmentation object.

#### bodySegmentation.detectStart()

This method repeatedly outputs segmentation masks on an image media through a callback function.

```javascript
bodySegmentation.detectStart(media, callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the segmentation on.

- **callback(output, error)**: A function to handle the output of `bodySegmentation.detectStart()`. Likely a function to do something with the segmented image. See below for the output passed into the callback function:

  ```javascript
  {
    mask: {},//A p5 Image object, can be directly passed into p5 image() function
    maskImageData: {}//A ImageData object
  }
  ```

#### bodySegmentation.detectStop()

This method can be called after a call to `bodySegmentation.detectStart` to stop the repeating pose estimation.

```javascript
bodySegmentation.detectStop();
```

#### bodySegmentation.detect()

This method asynchronously outputs a single segmentation mask on an image media when called.

```javascript
bodySegmentation.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the segmentation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the segmentation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.bodyPose

### Description

BodyPose can be used for real-time human pose Estimation.

### Methods

#### ml5.bodyPose()

This method is used to initialize the bodyPose object.

```javascript
const bodyPose = ml5.bodyPose(?modelName, ?options, ?callback);
```

**Parameters:**

- **modelName**: OPTIONAL: A string specifying which model to use, "BlazePose" or "MoveNet". MoveNet is an ultra fast and accurate model that detects 17 keypoints of a body. BlazePose can detect 33 keypoints and provides 3D tracking.
- **options**: OPTIONAL. An object to change the default configuration of the model. The default and available options for MoveNet model are:

  ```javascript
  {
    modelType: "MULTIPOSE_LIGHTNING", // "MULTIPOSE_LIGHTNING", "SINGLEPOSE_LIGHTNING", or "SINGLEPOSE_THUNDER"
    enableSmoothing: true,
    minPoseScore: 0.25,
    multiPoseMaxDimension: 256,
    enableTracking: true,
    trackerType: "boundingBox", // "keypoint" or "boundingBox"
    trackerConfig: {},
    modelUrl: undefined,
  }
  ```

  [More info on options for the MoveNet model](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/movenet#create-a-detector).

  The default and available options for BlazePose model are:

  ```javascript
  {
    runtime: "mediapipe", // "mediapipe" or "tfjs"
    enableSmoothing: true,
    modelType: "full", // "lite", "full", or "heavy"
    detectorModelUrl: undefined, //default to use the tf.hub model
    landmarkModelUrl: undefined, //default to use the tf.hub model
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/pose",
  }
  ```

[More info on options for BlazePose model with mediapipe runtime](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_mediapipe#create-a-detector).

[More info on options for BlazePose model with tfjs runtime](https://github.com/tensorflow/tfjs-models/tree/master/pose-detection/src/blazepose_tfjs#create-a-detector).

- **callback(bodyPose, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.bodyPose()` within the p5 `preload` function.

**Returns:**  
The bodyPose object.

#### bodyPose.detectStart()

This method repeatedly outputs pose estimations on an image media through a callback function.

```javascript
bodyPose.detectStart(media, callback);
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

  **For MoveNet model:**

  ![Keypoint diagram for MoveNet model](https://camo.githubusercontent.com/c3641b718d7e613b2ce111a6a4575e88ca35a60cb325efdd9113c453b2a09301/68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f6d6f76656e65742f636f636f2d6b6579706f696e74732d3530302e706e67)

  **For BlazePose model:**
  ![Keypoint diagram for BlazePose model](https://camo.githubusercontent.com/17082997c33fc6d2544c4aea33d9898860cf902ed5a0b865527d1dd91bbc7efa/68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f6d65646961706970652f626c617a65706f73652d6b6579706f696e74732d757064617465642e706e67)

#### bodyPose.detectStop()

This method can be called after a call to `bodyPose.detectStart` to stop the repeating pose estimation.

```javascript
bodyPose.detectStop();
```

#### bodyPose.detect()

This method asynchronously outputs a single pose estimation on an image media when called.

```javascript
bodyPose.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the estimation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.faceMesh

### Description

FaceMesh can be used for real-time face landmark Estimation.

### Methods

#### ml5.faceMesh()

This method is used to initialize the faceMesh object.

```javascript
const faceMesh = ml5.faceMesh(?options, ?callback);
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

  [More info on options here](https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection/src/mediapipe#create-a-detector).

- **callback(faceMesh, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.faceMesh()` within the p5 `preload` function.

**Returns:**  
The faceMesh object.

#### faceMesh.detectStart()

This method repeatedly outputs face estimations on an image media through a callback function.

```javascript
faceMesh.detectStart(media, callback);
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

  [Here is a diagram for the position of each keypoint](https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg) (download and zoom in to see the index numbers).

#### faceMesh.detectStop()

This method can be called after a call to `faceMesh.detectStart` to stop the repeating face estimation.

```javascript
faceMesh.detectStop();
```

#### faceMesh.detect()

This method asynchronously outputs a single face estimation on an image media when called.

```javascript
faceMesh.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the estimation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.handPose

### Description

HandPose can be used for real-time hand Estimation.

### Methods

#### ml5.handPose()

This method is used to initialize the handPose object.

```javascript
const handPose = ml5.handPose(?options, ?callback);
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

  [More info on options for mediapipe runtime](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection/src/mediapipe#create-a-detector).

  [More info on options for tfjs runtime](https://github.com/tensorflow/tfjs-models/tree/master/hand-pose-detection/src/tfjs#create-a-detector).

- **callback(handPose, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.handPose()` within the p5 `preload` function.

**Returns:**  
The handPose object.

#### handPose.detectStart()

This method repeatedly outputs hand estimations on an image media through a callback function.

```javascript
handPose.detectStart(media, callback);
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

  ![Keypoint Diagram](https://camo.githubusercontent.com/385c0bf768a8afc7aaa4ad5413a70284db1b0d14317b234b7ae69a105032ac01/68747470733a2f2f6d65646961706970652e6465762f696d616765732f6d6f62696c652f68616e645f6c616e646d61726b732e706e67)

#### handPose.detectStop()

This method can be called after a call to `handPose.detectStart` to stop the repeating hand estimation.

```javascript
handPose.detectStop();
```

#### handPose.detect()

This method asynchronously outputs a single hand estimation on an image media when called.

```javascript
handPose.detect(media, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the estimation on.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the estimation, see output example above.

**Returns:**  
A promise that resolves to the estimation output.

### Examples

TODO (link p5 web editor examples once uploaded)

---

## ml5.imageClassifier

### Description

ImageClassifier can be used to label images.

### Methods

#### ml5.imageClassifier()

This method is used to initialize the imageClassifer object.

```javascript
const imageClassifier = ml5.imageClassifier(?modelName, ?options, ?callback);
```

**Parameters:**

- **modelName**: OPTIONAL. Name of the underlying model to use. Current available models are `MobileNet`, `Darknet`, `Darknet-tiny` and `Doodlenet`. It is also possible to use a custom Teachable Machine model using its model.json url. Defaults to `Mobilenet`.

- **options**: OPTIONAL. An object to change the default configuration of the model.

- **callback(handPose, error)**: OPTIONAL. A function to run once the model has been loaded. Alternatively, call `ml5.imageClassifier()` within the p5 `preload` function.

**Returns:**  
The imageClassifier object.

#### imageClassifier.classifyStart()

This method repeatedly outputs classification labels on an image media through a callback function.

```javascript
imageClassifier.classifyStart(media, ?kNumber, callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the classification on.
- **kNumber**: The number of labels returned by the image classification.
- **callback(output, error)**: A callback function to handle the output of the classification. See below for an example output passed into the callback function:

  ```javascript
  [
    {
      label: '...',
      confidence: ...
    }
    ...
  ]
  ```

#### imageClassifier.classifyStop()

This method can be called after a call to `imageClassifier.classifyStart` to stop the repeating classifications.

```javascript
imageClassifier.classifyStop();
```

#### imageClassifier.classify()

This method asynchronously outputs a single image classification on an image media when called.

```javascript
imageClassifier.classify(media, ?kNumber, ?callback);
```

**Parameters:**

- **media**: An HTML or p5.js image, video, or canvas element to run the classification on.
- **kNumber**: The number of labels returned by the image classification.
- **callback(output, error)**: OPTIONAL. A callback function to handle the output of the classification.

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
