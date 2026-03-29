/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * Example: handPose — Offline / Cached Mode
 *
 * This sketch demonstrates how to use ml5.handPose with the { cache: true }
 * option for offline-capable installations and exhibitions.
 *
 * How it works:
 *   - First load (online):  the model downloads from the network and is
 *     automatically saved to IndexedDB in your browser.
 *   - Later loads (offline): the model loads directly from IndexedDB —
 *     no internet connection needed.
 *
 * Three ways to interact with the cache:
 *   ⬇  Pre-Download  — calls ml5.cacheModel("handPose") to cache the model
 *                       *before* running the sketch, ideal for setup day.
 *   ▶  Start HandPose — calls ml5.handPose({ cache: true }) to load the model
 *                       (from cache if available, otherwise from network) and
 *                       begin live hand tracking.
 *   🗑  Clear Cache   — calls ml5.clearCache() to wipe all ml5 IndexedDB entries,
 *                       useful for forcing a fresh download.
 */

let handPose;
let video;
let hands = [];

// App state
let isRunning = false;

// DOM references
const statusBar = document.getElementById("status-bar");
const btnCache = document.getElementById("btn-cache");
const btnStart = document.getElementById("btn-start");
const btnClear = document.getElementById("btn-clear");

// Check the initial cache status
async function checkCacheStatus() {
  setStatus("Checking IndexedDB cache…");
  const cached = await ml5.isCached("handPose");
  if (cached) {
    setStatus("Model is cached — you can go offline and click Start HandPose.");
  } else {
    setStatus(
      "Model not yet cached. Click Pre-Download to cache it, or Start HandPose to download and cache automatically."
    );
  }
}

function setup() {
  createCanvas(640, 480);

  // Create the webcam capture but keep it hidden — we draw it to the canvas.
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Setup button callbacks
  btnCache.addEventListener("click", onPreDownload);
  btnStart.addEventListener("click", onStart);
  btnClear.addEventListener("click", onClearCache);

  checkCacheStatus();
}

function draw() {
  if (isRunning) {
    // Draw the webcam video
    image(video, 0, 0, width, height);

    // Draw all the tracked hand points
    for (let i = 0; i < hands.length; i++) {
      let hand = hands[i];
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }
  } else {
    // Idle state
    background(200);
    fill(100);
    noStroke();
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
      "Webcam will appear here after\nclicking Start HandPose",
      width / 2,
      height / 2
    );
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  hands = results;
}

// ─── Button handlers ──────────────────────────────────────────────────────────

async function onPreDownload() {
  btnCache.disabled = true;
  btnStart.disabled = true;

  setStatus("Downloading HandPose models and saving to IndexedDB…");

  try {
    await ml5.cacheModel("handPose");
    setStatus(
      "Models cached successfully! You can now disconnect from the internet and use Start HandPose."
    );
  } catch (err) {
    setStatus(`Download failed: ${err.message}`);
  }

  btnCache.disabled = false;
  btnStart.disabled = false;
}

async function onStart() {
  btnCache.disabled = true;
  btnStart.disabled = true;

  const cached = await ml5.isCached("handPose");
  if (cached) {
    setStatus("Loading HandPose from local cache…");
  } else {
    setStatus(
      "Downloading HandPose models (first time — this may take a moment)…"
    );
  }

  // Pass { cache: true } to load from cache or save to cache
  handPose = await ml5.handPose({ cache: true });

  const nowCached = await ml5.isCached("handPose");
  setStatus(
    nowCached
      ? "Running — model loaded from cache. Safe to go offline!"
      : "Running — model loaded from network (cache unavailable)."
  );

  isRunning = true;
  handPose.detectStart(video, gotHands);

  btnStart.textContent = "HandPose Running";
  btnStart.disabled = true;
  btnCache.disabled = false;
}

async function onClearCache() {
  btnClear.disabled = true;

  setStatus("Clearing ml5 model cache…");
  const count = await ml5.clearCache();

  if (count > 0) {
    setStatus(
      `Removed ${count} cached model file${
        count !== 1 ? "s" : ""
      } from IndexedDB.`
    );
  } else {
    setStatus("Cache was already empty.");
  }

  btnClear.disabled = false;
}

function setStatus(message) {
  if (statusBar) statusBar.textContent = message;
  console.log("[handPose-offline]", message);
}
