import neuralNetwork from "./NeuralNetwork/taskSelection";
import handPose from "./HandPose";
import sentiment from "./Sentiment";
import faceMesh from "./FaceMesh";
import bodyPose from "./BodyPose";
import imageClassifier from "./ImageClassifier";
import soundClassifier from "./SoundClassifier";
import objectDetector from "./ObjectDetector";
import setBackend from "./utils/setBackend";
import bodySegmentation from "./BodySegmentation";
import depthEstimation from "./DepthEstimation";
import communityStatement from "./utils/communityStatement";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import packageInfo from "../package.json";

const withPreload = {
  bodyPose,
  bodySegmentation,
  depthEstimation,
  faceMesh,
  handPose,
  imageClassifier,
  neuralNetwork,
  sentiment,
  soundClassifier,
  objectDetector
};

const withoutAsync = {
  neuralNetwork,
};

const ml5 = Object.assign({ p5Utils }, withPreload, {
  tf,
  tfvis,
  setBackend,
  version: packageInfo.version,
  setP5: p5Utils.setP5.bind(p5Utils),
});

p5Utils.setupP5Integration(ml5, Object.keys(withPreload), Object.keys(withoutAsync));

communityStatement();

export default ml5;