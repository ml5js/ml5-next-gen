// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { asyncLoadImage } from "../utils/testingUtils";
import bodypose from "./index";

const POSENET_IMG =
  "https://github.com/ml5js/ml5-adjacent/raw/master/02_ImageClassification_Video/starter.png";

describe("bodypose", () => {
  let myBodypose;

  beforeAll(async () => {
    myBodypse = await new Promise((resolve, reject) => {
      bodypose(() => {
        resolve();
      });
    });
  });

  it("instantiates poseNet", () => {
    expect(myBodypose).toBeDefined();
  });
});
