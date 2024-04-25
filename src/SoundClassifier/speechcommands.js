// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import * as tfjsSpeechCommands from "@tensorflow-models/speech-commands";
import getTopKClasses from "../utils/gettopkclasses";
import modelLoader from "../utils/modelLoader";
import {instance} from "./index";

export class SpeechCommands {
  constructor(options) {
    this.options = options;
  }

  async load(url) {
    if (url) {
      const loader = modelLoader(url);
      this.model = tfjsSpeechCommands.create(
        "BROWSER_FFT",
        undefined,
        loader.modelUrl,
        loader.metadataUrl
      );
    } else this.model = tfjsSpeechCommands.create("BROWSER_FFT");
    await this.model.ensureModelLoaded();
    this.allLabels = this.model.wordLabels();
  }

  classify(topk = this.allLabels.length, cb) {
    return this.model
      .listen(async (result) => {
        if (result.scores) {
          const classes = await getTopKClasses(
            result.scores,
            topk,
            this.allLabels
          );          
          // if classifyStop is called stop the continuous listening
          if (instance.signalStop){
            this.model.stopListening();
            instance.isClassifying = false;
            return
          } 
          return cb(classes);
        }
        return cb(null, `ERROR: Cannot find scores in result: ${result}`);
      }, this.options)
      .catch((err) => {
        return cb(null, `ERROR: ${err.message}`);
      });
  }
}

export async function load(options, url) {
  const speechCommandsModel = new SpeechCommands(options);
  await speechCommandsModel.load(url);
  return speechCommandsModel;
}
