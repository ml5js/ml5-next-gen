import neuralNetwork from "./NeuralNetwork";
import handpose from "./Handpose";
import sentiment from "./Sentiment";
import faceMesh from "./FaceMesh";
import bodyPose from "./BodyPose";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import setBackend from "./utils/setBackend";
import bodySegmentation from "./BodySegmentation";
import communityStatement from "./utils/communityStatement";

export default Object.assign(
  { p5Utils },
  {
    tf,
    tfvis,
    neuralNetwork,
    handpose,
    sentiment,
    faceMesh,
    bodyPose,
    setBackend,
    bodySegmentation,
  }
);

communityStatement();
