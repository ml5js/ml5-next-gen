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

## Process

_This section explains how this repository was creates and is for reference purposes only. The steps outlines in this section do not need to be followed by contributors._

I am building the library using Webpack, which was installed with:

```
npm install --save-dev webpack webpack cli
```

I also created package.json using `npm init` and set up a basic config file for a library build named `webpack.config.js`. I configured package.json so I could run webpack with `npm run build`.

From the original ml5 library's `src` folder, I copied over all source files from the `NeuralNetwork` directory and necessary dependency files from `utils` directory. I also copied over `index.js` from the `src` folder and deleted everything unrelated to NeuralNetwork. I then installed `@tensorflow/tfjs@4.2.0`, `@tensorflow/tfjs-vis@1.5.1`, and `axios@1.3.4` with npm.

At this point, the library can be built without error. I was only getting an error about exceeding recommended size limit. For the build, I am using the latest version of node, npm, and tfjs. I have not tested all the features of NeuralNetwork, but it appears to be working just fine.

## Utils

This section documents the utility functions found in the `src/utils` folder.

### handleOptions

`handleOptions` is a function that filters a user defined options object based on a mold object, returning a filtered options object.

```js
const filteredOptions = handleOptions(optionsObject, moldObject);
```

#### `optionsObject`

The `optionsObject` is an object defined by the user to configure the settings of a model. For example, the below object configures the `handpose` model to detect a maximum of 4 hands using the "full" variant:

```js
const optionsObject = {
  maxHands: 4,
  modelType: full,
};
```

#### `moldObject`

Inspired by [Mongoose Models](https://mongoosejs.com/docs/models.html), the `moldObject` defines how the `optionsObject` should be filtered. Here is an example `optionsObject`:

```js
const mold = {
  maxHands: {
    type: "number",
    min: 1,
    default: 2,
  },
  runtime: {
    type: "enum",
    enums: ["mediapipe", "tfjs"],
    default: "mediapipe",
  },
  modelType: {
    type: "enum",
    enums: ["lite", "full"],
    default: "full",
  },
};
```

#### Rules in `moldObject`

The `moldObject` consists of key-value pairs. The key defines the name of the an option, and the value is an object that contains rules on how the option should be filtered. Here are the rules:

- `type` (required): A string defining the correct type of the option, can be `"number"`, `"boolean"`, `"enum"`, or `"string"`.
- `min` (optional): A number defining the minimum value for `type: "number"`.
- `max` (optional): A number defining the maximum value for `type: "number"`.
- `enums` (required when `type: "enum"`): An array that defines a list of valid values for the option.
- `caseInsensitive` (optional): A boolean that defaults to `true`. When true, checks the user value against the enum list case-insensitively.
- `default` (required): The default value of an options in case the user does not provide a value or provides an erroneous value.

#### Functions As Rules

A rule can be a constant value or a function that is dynamically evaluated. Use the `this` keyword to access the values of other options. Below is an example usage:
`Example usage`

```js
const mold = {
  runtime: {
    type: "enum",
    enums: ["mediapipe", "tfjs"],
    default: "mediapipe",
  },
  maxHands: {
    type: "number",
    min: 1,
    default: function () {
      return this.runtime === "mediapipe" ? 4 : 2;
    },
  },
};
```

When the user sets the runtime to `mediapipe`, the default `maxHands` evaluates to `4`, and when the user sets the runtime to `tfjs`, the default `maxHands` evaluates to `2`.

**Caveat:** the options gets evaluated from top to bottom, `runtime` must be placed above `maxHands` for the function to work properly.

#### Mechanism

For each key in the `moldObject`, the function adds a property to the filtered output object. The function initially checks if the same key exists in user's `optionsObject`. If the user provides a value for the given option, the value is then checked against the rules outlined in the `moldObject`. In case the user-defined value is erroneous (e.g. having a incorrect type or specifying a value not present in the enum array), the function generates a friendly warning in the console and resorts to the default value; otherwise the user's correct value will be used in the output object. If the user does not provide a value for the given option, the default value specified in the `moldObject` will be used.
