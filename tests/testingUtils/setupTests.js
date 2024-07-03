// Copyright (c) 2018-2024 ml5
//
// This software is open source and the ml5.js license.
// https://github.com/ml5js/ml5-next-gen/blob/88f7a3b260c59de84a7e4dab181cd3f69ba19bb1/LICENSE.md

import "@tensorflow/tfjs-node"; // loads the tensorflow/node backend to the registry
import crossFetch from "cross-fetch";
import * as tf from "@tensorflow/tfjs";

async function setupTests() {
  console.log("Beginning setup");

  await tf.setBackend("tensorflow");
  tf.env().set("IS_BROWSER", false);
  tf.env().set("IS_NODE", true);

  // Use cross-fetch as a polyfill for the browser fetch
  if (!global.fetch) {
    global.fetch = crossFetch;
  }

  console.log("Setup complete");
}

module.exports = setupTests;
