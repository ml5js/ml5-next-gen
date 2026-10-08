import { pipeline } from "@huggingface/transformers";
import handleArguments from "../utils/handleArguments";

/**
 * Maps ml5-friendly model names to their Hugging Face model ids.
 * Add new transformer-based speech recognizers here.
 */
const TRANSFORMER_MODELS = {
  WhisperTiny: "Xenova/whisper-tiny",
};

/**
 * Chooses the best available device for running the model.
 * Prefers WebGPU for better performance, falls back to WASM.
 * @returns {string} The device to use ("webgpu" or "wasm").
 * @private
 */
function chooseDevice() {
  if (typeof navigator !== "undefined" && navigator.gpu) return "webgpu";
  return "wasm";
}

/**
 * Speech to text transcriber using a Whisper model from Hugging Face Transformers.js
 * @reference https://huggingface.co/docs/transformers.js/en/api/pipelines#module_pipelines.AutomaticSpeechRecognitionPipeline
 */
export class SpeechToTextTransformer {
  /**
   * @param {string} modelName - Key into TRANSFORMER_MODELS (e.g. "WhisperTiny")
   * @param {Object} options
   * @param {function} callback
   */
  constructor(modelName = "WhisperTiny", options = {}, callback) {
    this.transcriber = null;
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.device = options.device || chooseDevice();

    const hfModelId = TRANSFORMER_MODELS[modelName];
    if (!hfModelId) {
      throw new Error(
        `Unknown transformer model "${modelName}". Options: ${Object.keys(
          TRANSFORMER_MODELS
        ).join(", ")}`
      );
    }

    // Print which underlying HF model is being loaded
    console.log(
      `ml5.speechToText: loading "${modelName}" → Hugging Face model "${hfModelId}"`
    );

    this.ready = pipeline("automatic-speech-recognition", hfModelId, {
      ...options,
      device: this.device,
    }).then((transcriber) => {
      this.transcriber = transcriber;
      console.log("Model Loaded!");
      callback?.(this);
      return this;
    });
  }

  /**
   * Transcribes an audio file or url and returns the recognized text.
   * @param {string} url - A url (or object url) pointing to the audio to transcribe.
   * @returns {Promise<Object>} An object containing the transcribed text.
   * @public
   */
  async transcribe(url) {
    await this.ready;
    console.log("Transcribing...");
    // Give the browser a moment to update before the heavy work begins
    await new Promise((r) => setTimeout(r, 10));
    return await this.transcriber(url);
  }

  /**
   * Starts recording audio from the microphone.
   * @public
   */
  async startListening() {
    await this.ready;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
    this.audioChunks = [];
    this.mediaRecorder.ondataavailable = (e) => this.audioChunks.push(e.data);
    this.mediaRecorder.start();
    console.log("Recording...");
  }

  /**
   * Stops recording and transcribes what was recorded.
   * @param {function} [callback] - A callback function to handle the transcription result.
   * @returns {Promise<Object>} An object containing the transcribed text.
   * @public
   */
  async stopListening(callback) {
    if (!this.mediaRecorder) return;
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = async () => {
        // Release the microphone so the browser's recording indicator turns off
        this.mediaRecorder.stream.getTracks().forEach((track) => track.stop());

        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const result = await this.transcribe(audioUrl);
        URL.revokeObjectURL(audioUrl);

        // Output the result via callback and/or promise
        if (callback) callback(result);
        resolve(result);
      };
      this.mediaRecorder.stop();
    });
  }
}

/**
 * Factory function exposed to users as ml5.speechToText.
 * @param {string} modelName - Key into TRANSFORMER_MODELS (e.g. "WhisperTiny")
 * @param {Object | function} [optionsOrCallback] - Options for the model, or a callback function.
 * @param {function} [cb] - A callback function called when the model has loaded.
 * @returns {SpeechToTextTransformer}
 * @public
 */
const speechToText = (modelName, optionsOrCallback, cb) => {
  const {
    string,
    options = {},
    callback,
  } = handleArguments(modelName, optionsOrCallback, cb);
  return new SpeechToTextTransformer(string, options, callback);
};

export default speechToText;
