# ml5-neuralnetwork-test-build

Welcome to the next-generation repo for the ml5.js project! Due to the complexities inherent in updating all the dependencies in [the original repo](https://github.com/ml5js/ml5-library), we're exploring rebuilding from the ground up. This fresh repository allows us to migrate over classes and functions one at a time. This is very much a work in progress and is currently in its early, experimental stage. We appreciate your patience as we work towards refining this next evolution of the ml5.js project. Stay tuned!

## Setup

This build uses node version 18.15.0 and npm version.
Install nvm and run the following commands：

```
nvm install 18.15
nvm use 18
```

To build the library, run the following commands:

```
npm install
npm run build
```

This will create the build in the dist folder.

Open `examples/NeuralNetwork/index.html` in the browser to see the build running an example from the ml5 website.
