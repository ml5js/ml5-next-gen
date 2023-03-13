# ml5-neuralnetwork-test-build
This repo is a test to see what it would take to create a new build for ml5.

## Setup
This build uses node version 18.15.0 and npm version.
Install nvm and run the following commands：
```
nvm install 18.15
nvm use 18
```

## Process
I built the library using Webpack:
```
npm install --save-dev webpack webpack cli
```
Then I created package.json using `npm init`.
