import { neuralNetwork } from "./NeuralNetwork";
import { handPose } from "./HandPose";
import { sentiment } from "./Sentiment";
import { faceMesh } from "./FaceMesh";
import { bodyPose } from "./BodyPose";
import { imageClassifier } from "./ImageClassifier";
import { soundClassifier } from "./SoundClassifier";
import { bodySegmentation } from "./BodySegmentation";
import setBackend from "./utils/setBackend";
import communityStatement from "./utils/communityStatement";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import packageInfo from "../package.json";

communityStatement();

const version = packageInfo.version;
const setP5 = p5Utils.setP5.bind(p5Utils);

export {
  bodyPose,
  bodySegmentation,
  faceMesh,
  handPose,
  imageClassifier,
  neuralNetwork,
  sentiment,
  soundClassifier,
  p5Utils,
  tf,
  tfvis,
  setBackend,
  version,
  setP5,
};
