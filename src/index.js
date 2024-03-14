import neuralNetwork from "./NeuralNetwork";
import handpose from "./Handpose";
import poseDetection from "./PoseDetection";
import soundClassifier from "./SoundClassifier";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import preloadRegister from "./utils/p5PreloadHelper";

const withPreload = {
  soundClassifier,
};

export default Object.assign(
  { p5Utils },
  preloadRegister(withPreload),
  {
    tf,
    tfvis,
    neuralNetwork,
    handpose,
    poseDetection,
  }
);
