// Copyright (c) 2018-2024 ml5
//
// This software is open source and the ml5.js license.
// https://github.com/ml5js/ml5-next-gen/blob/88f7a3b260c59de84a7e4dab181cd3f69ba19bb1/LICENSE.md

export const asyncLoadImage = async (src) => {
  const img = new Image();
  if (src.startsWith("http")) {
    img.crossOrigin = "true";
  }
  img.src = src;
  await new Promise((resolve) => {
    img.onload = resolve;
  });
  return img;
};

export const getRobin = async () => {
  return asyncLoadImage(
    "https://cdn.jsdelivr.net/gh/ml5js/ml5-library@main/assets/bird.jpg"
  );
};

export const randomImageData = (width = 200, height = 100) => {
  const length = width * height * 4; // 4 channels - RGBA
  // Create an array of random pixel values
  const array = Uint8ClampedArray.from({ length }, () =>
    Math.floor(Math.random() * 256)
  );
  // Initialize a new ImageData object
  return { width, height, data: array };
};
