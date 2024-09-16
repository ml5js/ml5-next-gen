import ml5 from "../index";

import { HandPose } from "../HandPose";
import loadHandPoseOfflineModel from "./HandPose";

HandPose.prototype.loadOfflineModel = loadHandPoseOfflineModel;

export default ml5;
