import neuralNetwork from "./NeuralNetwork";
import handpose from "./Handpose";
import poseDetection from "./PoseDetection";
import languageModel from "./LanguageModel";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import setBackend from "./utils/setBackend";

export default Object.assign(
  { p5Utils },
  {
    tf,
    tfvis,
    neuralNetwork,
    handpose,
    poseDetection,
    setBackend,
    languageModel,
  }
);
