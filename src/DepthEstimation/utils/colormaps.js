/**
 * Color map functions used to visualize depth data.
 * 
 * @typedef {'COLOR' | 'GRAYSCALE'} ColormapName
 */

/**
 * @typedef {function(number): [number, number, number]} ColormapFunction
 * A function that takes a normalized value (0-1) and returns an [R, G, B] array (0-255).
 */

/**
 * @type {Object.<ColormapName, ColormapFunction>}
 * A collection of colormap functions for visualizing depth data.
 */
export const COLORMAPS = {
  /** Color colormap: yellow (close) -> green -> cyan -> blue -> purple (far). */
  COLOR: (value) => {
    let r = 0,
      g = 0,
      b = 0;
    const v = Math.max(0, Math.min(1, value)); // Clamp value to [0, 1]

    if (v < 0.25) {
      // Yellow (1,1,0) -> Green (0,1,0)
      const t = v * 4; // t goes from 0 to 1
      r = 1 - t;
      g = 1;
      b = 0;
    } else if (v < 0.5) {
      // Green (0,1,0) -> Cyan (0,1,1)
      const t = (v - 0.25) * 4; // t goes from 0 to 1
      r = 0;
      g = 1;
      b = t;
    } else if (v < 0.75) {
      // Cyan (0,1,1) -> Blue (0,0,1)
      const t = (v - 0.5) * 4; // t goes from 0 to 1
      r = 0;
      g = 1 - t;
      b = 1;
    } else {
      // Blue (0,0,1) -> Purple (0.5, 0, 1)
      const t = (v - 0.75) * 4; // t goes from 0 to 1
      r = t * 0.5; // Increase red towards purple
      g = 0;
      b = 1;
    }
    // Scale to 0-255
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  },
  /** Grayscale colormap: black to white. */
  GRAYSCALE: (value) => {
    const v = 255 - Math.round(value * 255);
    return [v, v, v];
  },
};