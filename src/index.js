import neuralNetwork from "./NeuralNetwork";
import handPose from "./HandPose";
import sentiment from "./Sentiment";
import faceMesh from "./FaceMesh";
import bodyPose from "./BodyPose";
import imageClassifier from "./ImageClassifier";
import soundClassifier from "./SoundClassifier";
import setBackend from "./utils/setBackend";
import bodyPix from "./BodySegmentation";
import communityStatement from "./utils/communityStatement";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import preloadRegister from "./utils/p5PreloadHelper";

const withPreload = {
  imageClassifier,
  soundClassifier,
};


export default Object.assign({ p5Utils }, preloadRegister(withPreload), {
  tf,
  tfvis,
  neuralNetwork,
  handPose,
  sentiment,
  faceMesh,
  bodyPose,
  setBackend,
  bodyPix,
});

communityStatement();
