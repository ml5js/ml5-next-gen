import neuralNetwork from "./NeuralNetwork";
import handpose from "./Handpose";
import facemesh from "./Facemesh";
import poseDetection from "./PoseDetection";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import p5Utils from "./utils/p5Utils";
import setBackend from "./utils/setBackend";
import bodyPix from "./BodySegmentation";

export default Object.assign(
  { p5Utils },
  {
    tf,
    tfvis,
    neuralNetwork,
    handpose,
    facemesh,
    poseDetection,
    setBackend,
    bodyPix,
  }
);
