# Troubleshooting manual model setup

Manual setup is mostly about putting the exact files in the exact folders your sketch expects. If something is not working, start with the Network tab in your browser's developer tools.

## My file saved as `model.json.txt`

Some systems hide file extensions or add `.txt` automatically. The file must be named exactly `model.json`.

On Windows, turn on **View → File name extensions** in File Explorer, then rename `model.json.txt` to `model.json`.

## I see a 404 in the Network tab

A 404 means the browser asked for a file, but your local server could not find it.

Check:

- Is the file actually in your `ml5-models/` folder?
- Is the filename exactly the same, including underscores and capitalization?
- Is `ml5-models/` next to the `index.html` file that opened in the browser?
- Does your `modelPath` match the folder name?

## The page loads, but nothing is detected

This is often a runtime mismatch.

For TFJS files, use a model root such as:

```js
ml5.handPose({ modelPath: "./ml5-models/handpose" });
```

For MediaPipe files, include the MediaPipe runtime option when the model supports it:

```js
ml5.handPose({ runtime: "mediapipe", modelPath: "./ml5-models/handpose" });
```

Also make sure your webcam permission is allowed and your face, hand, or body is visible in the video.

## I see MIME type or `application/octet-stream` errors

Do not open the page with `file://`. Use a local server, such as VS Code Live Server or:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Files still load from `cdn.jsdelivr.net`, `tfhub.dev`, or `storage.googleapis.com`

That usually means ml5 could not find your local files and fell back to its normal online URLs.

Check the Network tab for the first local 404. Fix that missing file or folder first.

## The `model.json` mentions files I did not download

Open `model.json` and look for `weightsManifest`. Every filename in the `paths` list must be downloaded into the same folder as that `model.json`.

Sometimes a model has one shard. Sometimes it has several. Trust the `model.json` you downloaded.

## The shard count is different from the docs

Model hosts can change how files are split. The important rule is: download every shard listed in your `model.json`.

## Can I use this in the p5.js Web Editor?

The p5.js Web Editor is wonderful for sharing sketches, but it is not a good place to bundle large local model folders. For Web Editor sketches, use the normal online loading path, or browser caching if available.

## My sketch is in a subfolder. Where does `ml5-models/` go?

`modelPath` is relative to the HTML page that loads your sketch. If your browser opens `my-sketch/index.html`, then `./ml5-models/handpose` means:

```text
my-sketch/
  index.html
  sketch.js
  ml5-models/
    handpose/
```
