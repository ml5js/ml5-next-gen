# ml5-neuralnetwork-test-build
This repo is a test to see what it would take to create a new build for ml5.

## Setup
This build uses node version 18.15.0 and npm version.
Install nvm and run the following commands：
```
nvm install 18.15
nvm use 18
```


To build the library, run the following commands:
```
cd package
npm install
npm run build
```
This will create a build in the dist folder.


Open `test/index.html` in the browser to see the build working, running an example from the ml5 website.


## Process
I am building the library using Webpack, which was installed with:
```
npm install --save-dev webpack webpack cli
```

I also created package.json using `npm init` and set up a basic config file for a library build named `webpack.config.js`. I configured package.json so I could run webpack with `npm run build`.


From the original ml5 library's `src` folder, I copied over all source files from the `NeuralNetwork` directory and necessary dependency files from `utils` directory. I also copied over `index.js` from the `src` folder and deleted everything unrelated to NeuralNetwork. I then installed `@tensorflow/tfjs@4.2.0`, `@tensorflow/tfjs-vis@1.5.1`, and `axios@1.3.4` with npm.


At this point, the library can be built without error. I was only getting an error about exceeding recommended size limit. For the build, I am using the latest version of node and all the npm dependencies. It seems like NeuralNetwork does not have any problems with that.


