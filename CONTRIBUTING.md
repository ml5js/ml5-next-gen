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
This will create the build in the dist folder.


Open `examples/NeuralNetwork/index.html` in the browser to see the build running an example from the ml5 website.
