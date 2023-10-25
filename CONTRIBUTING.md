## Setup

This build uses node version 18.15.0.
We use [Yarn](https://yarnpkg.com/) instead of npm to help us better manage dependencies from TensorFlow.js. Yarn is a newer package manager that is very similar to NPM. [Here is a cheat sheet](https://www.digitalocean.com/community/tutorials/nodejs-npm-yarn-cheatsheet) for npm vs Yarn commands.

[Install nvm](https://github.com/nvm-sh/nvm#installing-and-updating) and run the following commands：

```
nvm install 18.15
nvm use 18
npm install -g yarn
```

To start the development server, run the following commands:

```
yarn
yarn start
```

You should see something similar to this in the terminal:

```
[webpack-dev-server] Project is running at:
[webpack-dev-server] Loopback: http://localhost:8080/
...
...
webpack 5.76.1 compiled successfully in 8360 ms
```

A local server have been started and hosts a built version of the ml5 library at http://localhost:8080/dist/ml5.js. While the server is running, Webpack will automatically rebuild the library if you change and save any file in the `/src` folder.

A webpage at http://localhost:8080/examples/ should automatically open with the directory listing of the example directory. Select one of the directories to test run `ml5.js` in some example code.

## Code Formatting

To keep the coding style consistent, we will be using the Prettier formatter.

### Visual Studio Code

If you are using Visual Studio Code, you can install the Prettier extension by going to the **Extensions** tab and search for "Prettier". Click on **Prettier - Code formatter** and click **Install**.

Go to **File > Preferences > Settings**, search for "default formatter" and make sure **Prettier - Code formatter** is selected for **Editor: Default Formatter**.

To automatically format a document when saving it, search for "format on save" in the settings and make sure **Editor: Format On Save** is checked. Otherwise, you can use the VS Code keyboard shortcut to format an opened document, which is <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>f</kbd> for Windows or <kbd>shift</kbd> + <kbd>option</kbd> + <kbd>f</kbd> for Mac by default.

### Command Line

You can also format a document via the command line. To format all JavaScript documents in the repo, use:

```
yarn run format
```

To format a specific document, use

```
npx prettier --write path/to/file
```

For more options with the command line, refer to the [Prettier Documentation](https://prettier.io/docs/en/cli.html)

## Building the Library

To build the ml5 library for production, run the following commands

```
yarn
yarn run build
```

This will create a production version of the library in `/dist` directory.

## API Implementation Guideline

This guideline provides a high-level concept of what the ml5 library's API should look like, serving as a reference to keep the ml5 interface consistent and accessible to the users.

(Temporary note: This section does not fully reflect the current interface of the library, but rather proposes an ideal interface for future ml5.)

(Temporary note 2: This section is work in progress.)

### General Guidelines

1. All ml5 functions called by the user should be defined in camel case.

2. The user accesses an instance of the ml5 model by calling the factory function `ml5.<modelName>`. For example:

```javascript
let bodyPose = ml5.bodyPose("BlazePose");
let neuralNetwork = ml5.neuralNetwork();
```

4. When a string parameter is passed into any ml5 function as a configuration setting, it should be matched case insensitively For example, the following calls produce the same result:

   ```javascript
   let bodyPose = ml5.bodyPose("BlazePose", { modelType: "Full" });
   ```

   ```javascript
   let bodyPose = ml5.bodyPose("blazepose", { modelType: "full" });
   ```

5. When possible, a parameter should be optional and have default values in lieu of user definition.

6. ml5 should throw a friendly warning when the user passes in an invalid parameter, and proceed with the default value when possible. For example:
   ```javascript
   let bodyPose = ml5.bodyPose({ modelType: "foo" });
   // Console:
   // Warning: bodyPose does not have modelType "foo", using modelType "full" instead.
   ```
7. An ml5 function should be able to accept parameters in any order. For example, the following calls produce the same result:

   ```javascript
   let bodyPose = ml5.bodyPose("blazepose", { modelType: "full" });
   ```

   ```javascript
   let bodyPose = ml5.bodyPose({ modelType: "full" }, "blazepose");
   ```

8. Asynchronous ml5 functions should support the callback interface, and support the promise/async await interface as well when possible.

9. ml5's should call the callback functions with the pattern `callback(result, error)`.

10. The factory functions `ml5.<modelName>` should support p5's preload feature as well as the callback interface. Thus, the factory functions should synchronously/immediately return an instance of the ml5 model and load the underlying model asynchronously before calling the callback/releasing p5's preload hook.

### Image/Video-Based Detection Models

1. For image-based detection models, `ml5.<modelName>` should accept 3 optional parameters, `modelName`, `options`, and `modelReady`.

- **modelName**: A string, case insensitively specify the underlying model to use.
- **options**: An object, specifies configuration setting for the ml5 model.
- **modelReady**: A callback function that is called when the underlying model is ready. An instance of the ml5 is passed into the its first parameter no error occurs. Otherwise, an error object is pass into the second parameter.

2.

## Process

_This section explains how this repository was creates and is for reference purposes only. The steps outlines in this section do not need to be followed by contributors._

I am building the library using Webpack, which was installed with:

```
npm install --save-dev webpack webpack cli
```

I also created package.json using `npm init` and set up a basic config file for a library build named `webpack.config.js`. I configured package.json so I could run webpack with `npm run build`.

From the original ml5 library's `src` folder, I copied over all source files from the `NeuralNetwork` directory and necessary dependency files from `utils` directory. I also copied over `index.js` from the `src` folder and deleted everything unrelated to NeuralNetwork. I then installed `@tensorflow/tfjs@4.2.0`, `@tensorflow/tfjs-vis@1.5.1`, and `axios@1.3.4` with npm.

At this point, the library can be built without error. I was only getting an error about exceeding recommended size limit. For the build, I am using the latest version of node, npm, and tfjs. I have not tested all the features of NeuralNetwork, but it appears to be working just fine.
