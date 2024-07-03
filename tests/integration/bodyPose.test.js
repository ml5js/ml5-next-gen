// Copyright (c) 2018-2024 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { asyncLoadImage } from "../testingUtils";
import bodyPose from "../../src/Bodypose";
import crossFetch from "cross-fetch";

const POSENET_IMG =
  "https://github.com/ml5js/ml5-adjacent/raw/master/02_ImageClassification_Video/starter.png";

// TODO: run this in a browser
describe.skip("bodypose", () => {
  let myBodyPose;
  let image;

  beforeAll(async () => {

    // TODO: this should not be necessary! Should already be handled by setupTests.js.
    if (!global.fetch) {
      global.fetch = crossFetch;
    }

    myBodyPose = bodyPose();
    await myBodyPose.ready;

    image = await asyncLoadImage(POSENET_IMG);
  });

  it("instantiates bodyPose", () => {
    expect(myBodyPose).toBeDefined()
    expect(myBodyPose.model).toBeDefined();
  });

  it("detects poses in image", async () => {

    // Result should be an array with a single object containing the detection.
    const result = await myBodyPose.detect(image);
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("box");
    expect(result[0]).toHaveProperty("score");
    expect(result[0].keypoints.length).toBeGreaterThanOrEqual(5);

    // Verify a known outcome.
    const nose = result[0].keypoints.find(
      (keypoint) => keypoint.name === "nose"
    );
    // Should be {"name": "nose", "score": 0.7217329144477844, "x": 454.1112813949585, "y": 256.606980448618}
    expect(nose).toBeTruthy();
    expect(nose.x).toBeCloseTo(454.1, 0);
    expect(nose.y).toBeCloseTo(256.6, 0);
    expect(nose.score).toBeCloseTo(0.721, 2);
  });

  it("calls the user's callback",(done) => {
    expect.assertions(1);
    const callback = (result) => {
      expect(result).toHaveLength(1); // don't need to repeat the rest
      done();
    }
    myBodyPose.detect(image, callback);
  });
});
