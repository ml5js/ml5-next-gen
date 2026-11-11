import { COLORMAPS } from "./colormaps";
/**
 * Creates ImageData from depth values with colormap applied.
 * @param {number[][]} depthValues - 2D array of depth values
 * @param {number} width - Width of the depth map
 * @param {number} height - Height of the depth map
 * @param {number} minDepth - Minimum depth value for normalization
 * @param {number} maxDepth - Maximum depth value for normalization
 * @param {string} colormap - Colormap name ('COLOR' or 'GRAYSCALE')
 * @returns {ImageData} ImageData with colormap applied
 */
export function createImageDataFromDepthValues(
  depthValues,
  width,
  height,
  minDepth,
  maxDepth,
  colormap = "GRAYSCALE"
) {
  const imageData = new ImageData(width, height);
  const range = maxDepth - minDepth;
  const colormapKey = colormap.toUpperCase();
  const colormapFn = COLORMAPS[colormapKey] || COLORMAPS.GRAYSCALE;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const depthValue = depthValues[y][x];
      const normalizedValue =
        range === 0
          ? 0
          : Math.max(0, Math.min(1, (depthValue - minDepth) / range));
      const pixelIndex = (y * width + x) * 4;
      const [r, g, b] = colormapFn(normalizedValue);
      imageData.data[pixelIndex] = r;
      imageData.data[pixelIndex + 1] = g;
      imageData.data[pixelIndex + 2] = b;
      imageData.data[pixelIndex + 3] = 255; // Alpha
    }
  }
  return imageData;
}

/**
 * Converts ImageData or Canvas to p5.Image if p5 exists.
 * @param {ImageData | HTMLCanvasElement} inputImage - Input image data or canvas
 * @returns {p5.Image | ImageData | HTMLCanvasElement} p5.Image if p5 available, otherwise original input
 */
export function generateP5Image(inputImage) {
  if (window?.p5) {
    // Ensure p5 instance mode compatibility
    const p5Instance = window._p5Instance || window;
    if (p5Instance.createImage) {
      const img = p5Instance.createImage(inputImage.width, inputImage.height);
      if (inputImage instanceof ImageData) {
        img.loadPixels(); // Load pixels to prepare for setting
        img.pixels.set(inputImage.data); // Bulk copy pixel data
        img.updatePixels(); // Update pixels to apply changes
      } else if (inputImage instanceof HTMLCanvasElement) {
        // If inputImage is an HTMLCanvasElement, we can use it directly
        img.drawingContext.drawImage(inputImage, 0, 0);
      }
      return img;
    }
  }
  return inputImage; // Return original ImageData/Canvas if p5 or createImage not available
}

/**
 * Dilates a mask by a certain number of pixels and inverts it.
 * The silhouette becomes opaque and the background transparent.
 * @param {ImageData} imageData - Input mask as ImageData
 * @param {number} dilationFactor - Number of pixels to dilate (0-10)
 * @returns {ImageData} Dilated and inverted mask
 */

export function dilateMask(imageData, dilationFactor) {
  if (!imageData || !imageData.data) {
    return imageData; // No dilation if no data
  }

  const { width, height, data } = imageData;
  const newData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let index = (y * width + x) * 4;

      newData[index] = 0; // R
      newData[index + 1] = 0; // G
      newData[index + 2] = 0; // B
      newData[index + 3] = 255 - imageData.data[index + 3]; // Alpha from received mask, inverted

      // If this pixel has alpha = 0 (foreground pixel), check if it should become 255 (background)
      if (imageData.data[index + 3] === 0) {
        let dilated = false;

        // Check within the threshold radius
        for (let dy = -dilationFactor; dy <= dilationFactor && !dilated; dy++) {
          for (
            let dx = -dilationFactor;
            dx <= dilationFactor && !dilated;
            dx++
          ) {
            let checkX = x + dx;
            let checkY = y + dy;

            // Make sure we're within bounds
            if (
              checkX >= 0 &&
              checkX < width &&
              checkY >= 0 &&
              checkY < height
            ) {
              let checkIndex = (checkY * width + checkX) * 4;

              // If we find a neighboring pixel with alpha = 255, grow background into this pixel
              if (imageData.data[checkIndex + 3] === 255) {
                newData[index + 3] = 0; // Set alpha to 0 (background, because we inverted it, normally 255 is background)
                dilated = true;
              }
            }
          }
        }
      }
    }
  }

  return new ImageData(newData, width, height);
}

/** Flips ImageData horizontally. @private */
export function flipImageDataHorizontally(imageData) {
  const { width, height, data } = imageData;
  const newData = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const sourceIndex = (y * width + x) * 4;
      const targetIndex = (y * width + (width - 1 - x)) * 4;
      newData[targetIndex] = data[sourceIndex]; // R
      newData[targetIndex + 1] = data[sourceIndex + 1]; // G
      newData[targetIndex + 2] = data[sourceIndex + 2]; // B
      newData[targetIndex + 3] = data[sourceIndex + 3]; // A
    }
  }
  return new ImageData(newData, width, height);
}
