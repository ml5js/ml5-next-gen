import neuralNetwork from "./NeuralNetwork";
import handpose from "./Handpose";
import sentiment from "./Sentiment";
import facemesh from "./Facemesh";
import bodypose from "./Bodypose";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import setBackend from "./utils/setBackend";
import bodyPix from "./BodySegmentation";
import communityStatement from "./utils/communityStatement";
import imageClassifier from "./ImageClassifier";
import preloadRegister from "./utils/p5PreloadHelper";

const withPreload = {
  imageClassifier,
};


export default Object.assign(
  { p5Utils },
  preloadRegister(withPreload),
  {
    tf,
    tfvis,
    neuralNetwork,
    handpose,
    sentiment,
    facemesh,
    bodypose,
    setBackend,
    bodyPix,
  }
);

communityStatement();
