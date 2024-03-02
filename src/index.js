import neuralNetwork from "./NeuralNetwork";
import handPose from "./HandPose";
import sentiment from "./Sentiment";
import faceMesh from "./FaceMesh";
import bodyPose from "./BodyPose";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import setBackend from "./utils/setBackend";
import bodyPix from "./BodySegmentation";
import communityStatement from "./utils/communityStatement";
import imageClassifier from "./ImageClassifier";
import preloadRegister from "./utils/p5PreloadHelper";

const withPreload = {
    bodyPix,
    bodyPose,
    faceMesh,
    handPose,
    imageClassifier,
    neuralNetwork,
    sentiment,
};

const ml5 = Object.assign(
  { p5Utils },
  preloadRegister(withPreload),
  {
    tf,
    tfvis,
    setBackend,
  }
);

p5Utils.shouldPreload(ml5, Object.keys(withPreload));

communityStatement();

export default ml5;
