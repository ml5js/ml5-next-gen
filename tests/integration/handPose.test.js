// Copyright (c) 2020 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import crossFetch from 'cross-fetch';
import { asyncLoadImage } from "../testingUtils";
import handpose from "../../src/Handpose";

const HANDPOSE_IMG = "https://i.imgur.com/EZXOjqh.jpg";

// TODO: run this in a browser
describe.skip("Handpose", () => {
  let handposeInstance;
  let testImage;

  beforeAll(async () => {
    jest.setTimeout(10000);

    // TODO: this should not be necessary! Should already be handled by setupTests.js.
    if (!global.fetch) {
      global.fetch = crossFetch;
    }

    handposeInstance = handpose();
    await handposeInstance.ready;
  });

  it("detects hands in image", async () => {
    testImage = await asyncLoadImage(HANDPOSE_IMG);
    const handPredictions = await handposeInstance.predict(testImage);
    expect(handPredictions).not.toHaveLength(0);
    expect(handPredictions[0].landmarks).toBeDefined();
  });
});
