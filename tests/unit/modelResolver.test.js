import { joinUrl, getMediaPipeFiles } from "../../src/utils/modelRegistry";
import { resolveModelUrls } from "../../src/utils/modelResolver";

describe("local model registry helpers", () => {
  test("joinUrl normalizes duplicate slashes at the join boundary", () => {
    expect(joinUrl("./ml5-models/handpose/", "/tfjs/model/model.json")).toBe(
      "./ml5-models/handpose/tfjs/model/model.json"
    );
  });

  test("MediaPipe manifests include shared and variant assets", () => {
    const files = getMediaPipeFiles("handpose", "lite");
    expect(files).toContain("hands.binarypb");
    expect(files).toContain("hand_landmark_lite.tflite");
    expect(files).not.toContain("hand_landmark_full.tflite");
  });

  test("modelPath errors list probed URLs and model root hint", async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false });

    await expect(
      resolveModelUrls({
        modelName: "handpose",
        modelConfig: { runtime: "mediapipe" },
        userOptions: { modelPath: "./ml5-models/handpose/tfjs" },
      })
    ).rejects.toThrow(
      "Expected modelPath to point at the model root, for example './ml5-models/handpose'."
    );

    await expect(
      resolveModelUrls({
        modelName: "handpose",
        modelConfig: { runtime: "mediapipe" },
        userOptions: { modelPath: "./ml5-models/handpose/tfjs" },
      })
    ).rejects.toThrow("HEAD ./ml5-models/handpose/tfjs/manifest.json");
  });
});
