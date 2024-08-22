# How to Contribute

_last updated: 10, July 2024_

Welcome to the ml5.js project! Developing ml5.js is not just about developing machine learning software, it is about making machine learning approachable for a broad audience of artists, creative coders, and students. The library provides access to machine learning algorithms and models in the browser, building on top of TensorFlow.js with no other external dependencies. The library is supported by code examples, tutorials, and sample datasets with an emphasis on ethical computing. Bias in data, stereotypical harms, and responsible crowdsourcing are part of the documentation around data collection and usage. We're building friendly machine learning for the web - we're glad you're here!

## Table of Content

- [How to Contribute](#how-to-contribute)
  - [Table of Content](#table-of-content)
  - [The ml5.js Ecosystem](#the-ml5js-ecosystem)
  - [Contribution Workflow](#contribution-workflow)
  - [Setup Development Environment](#setup-development-environment)
  - [Code Formatting](#code-formatting)
    - [For Visual Studio Code](#for-visual-studio-code)
    - [For Command Line](#for-command-line)
  - [Building the Library](#building-the-library)
  - [Making Releases](#making-releases)
  - [Release Notes](#release-notes)
  - [Unit Tests](#unit-tests)
  - [Update p5 Web Editor Sketches](#update-p5-web-editor-sketches)
  - [All Contributors](#all-contributors)
  - [API Implementation Guideline](#api-implementation-guideline)
    - [General Guidelines](#general-guidelines)
    - [Image/Video-Based Detection Models](#imagevideo-based-detection-models)
  - [Utils](#utils)
    - [handleOptions](#handleoptions)
      - [`userObject`](#userobject)
      - [`moldObject`](#moldobject)
      - [Define a Rule in `moldObject`](#define-a-rule-in-moldobject)
      - [Functions As Rules](#functions-as-rules)

## The ml5.js Ecosystem

ml5.js is comprised a number of related repositories which you can find at the ml5.js github organization - [github.com/ml5js](https://github.com/ml5js). As a contributor of ml5.js you should be aware of the other parallel repositories of the ml5.js project.

Here is a list of the repositories you most likely will be working with:

- **[ml5-next-gen (this repository)](https://github.com/ml5js/ml5-next-gen)**: The main repository for the ml5.js library. The source code in this repository is bundled into the `ml5.js` library files and gets published on [npm](https://www.npmjs.com/package/ml5).
- **[ml5-website-v03-docsify](https://github.com/ml5js/ml5-website-v02-docsify)**: The repository for the [ml5.js documentation webpage](https://docs.ml5js.org), which is built using [Docsify](https://docsify.js.org/). It contains documentation and and reference materials for the ml5.js library users.
- **[ml5-website-v02-gatsby](https://github.com/ml5js/ml5-website-v02-gatsby)**: The repository for the [main ml5.js website](https://ml5js.org), which is built using [Gatsby](https://www.gatsbyjs.com/). It contains information about the ml5.js project, community, and resources.

## Contribution Workflow

**Preamble**: If you're interested in contributing to the ml5.js project, just know you can always open an issue to ask questions or flag things that may seem confusing, unclear or intimidating. Our goal is to make ml5.js as open and supportive as possible for those who want to be involved. Ok, now that's out of the way, here's how a general workflow for what contributions to ml5.js might look like.

1. Read the CONTRIBUTING.md document. ❤️
2. Take a peek at the [issues](https://github.com/ml5js/ml5-next-gen/issues) page and identify something you'd like to address **or** file a new issue. The issue could be about fixing a bug, adding a new feature, updating an existing feature, or anything else. 🚩
3. Make a comment on the existing issue **or** indicate on your new issue that you're curious to do your best to solve it. 🔬
4. Make a forked copy of the ml5-next-gen repository and create a branch with a meaningful name such as `fix-detection-results`. 🍴
5. Jam on some coding sessions, commit your changes with descriptive commit messages, and push your changes to your branch. 💻
6. When ready, [make a pull request to the `main` branch of ml5-next-gen](https://github.com/ml5js/ml5-next-gen/compare). 📄
7. The ml5.js dev team will review your changes and reply with feedback or questions. When all looks good, your changes will be merged in and released with the next public update to the library. 🎉
8. Hi-fives 👏 and hugs 🤗

**Note**: If you are new to making contributions on GitHub, a great resource to check out is [first-contributions](https://github.com/firstcontributions/first-contributions), a repository that walks you through the process of making your first contribution. If you have any questions about the contribution workflow of ml5.js, please don't hesitate to reach out to the ml5.js team.

## Setup Development Environment

We use node.js as our development environment for bundling code, running tests, and more. If you've never used node.js before, please [download and install Node.js here](https://nodejs.org/en/download/prebuilt-installer). Please select the lts/iron (`v20.x.x (LTS)`) of Node.js for your operating system and architecture of your computer.

If you already have a different version of Node.js installed, we recommend installing a Node.js version manager: [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) for macOS and Linux operating systems, and [nvm-windows](https://github.com/coreybutler/nvm-windows) Windows operating system. A Node.js version manager that allows you to quickly switch between different versions of Node.js.

**macOS and Linux:** To switch to the compatible Node.js version, run the following commands after installing nvm:

```
nvm install
nvm use
```

**Windows:** To switch to the compatible Node.js version, run the following commands after installing nvm-windows:

```
nvm install 20
nvm use 20
```

We use [Yarn](https://yarnpkg.com/) instead of npm to help us better manage dependencies from TensorFlow.js. Yarn is a newer package manager that is very similar to NPM. [Here is a cheat sheet for NPM vs Yarn commands](https://www.digitalocean.com/community/tutorials/nodejs-npm-yarn-cheatsheet).

Enable Corepack with the following command:

```
corepack enable
```

Then, run the following commands to install the dependencies and start the development server. Corepack may ask to download Yarn, select yes when prompted:

```
yarn
yarn start
```

_Note: If you are using nvm and run into issues with yarn versioning, it might be due to interference from another yarn installation. On macOS or Linux, use the_ `which yarn` _command to find the location interfering yarn installation. You should see something like_ `Users/user/.nvm/versions/node/<node_version>/bin/yarn`_. You can remove node.js installation using the_ `nvm uninstall <node_version>` _command. Lastly, repeat the setup guide._

You should see something similar to this in the terminal:

```
[webpack-dev-server] Project is running at:
[webpack-dev-server] Loopback: http://localhost:8080/
...
...
webpack 5.x.x compiled successfully in 8360 ms
```

A local server will start, hosting a built version of the ml5.js library at http://localhost:8080/dist/ml5.js. While the server is running, Webpack will automatically rebuild the library if you change and save any file in the `/src` folder.

A webpage at http://localhost:8080/examples/ should automatically open with the directory listing of the example sketches. Select one of the sketches to test run `ml5.js` with some example code.

## Code Formatting

To keep the coding style consistent, ml5.js uses the [Prettier code formatter](https://prettier.io/). Follow the instructions below to set up Prettier in your development environment.

### For Visual Studio Code

If you are using Visual Studio Code, you can install the Prettier extension by going to the **Extensions** tab and search for "Prettier". Click on **Prettier - Code formatter** and click **Install**.

Go to **File > Preferences > Settings**, search for "default formatter" and make sure **Prettier - Code formatter** is selected for **Editor: Default Formatter**.

To automatically format a document when saving it, search for "format on save" in the settings and make sure **Editor: Format On Save** is checked. Otherwise, you can use the VS Code keyboard shortcut to format an opened document, which is <kbd>shift</kbd> + <kbd>alt</kbd> + <kbd>f</kbd> on Windows or <kbd>shift</kbd> + <kbd>option</kbd> + <kbd>f</kbd> on Mac by default.

### For Command Line

You can also format a document via the command line. To format all JavaScript documents in the repo, use:

```
yarn run format
```

To format a specific document, use

```
npx prettier --write path/to/file
```

For more options with the command line, please refer to the [Prettier Documentation](https://prettier.io/docs/en/cli.html).

## Building the Library

To build the ml5.js library for production and publishing, run the following commands:

```
yarn
yarn run build
```

This will create a production version of the library in `/dist` directory.

## Making Releases

1. Create a new branch from the main branch and edit the SemVer number in `package.json`. Increment the version number based on [semantic versioning rules](https://semver.org/).

2. Run the following command to update the version number in `README.md`.

   ```
   yarn run update-readme
   ```

3. Commit the changes. Then, make a pull request from the new branch to main and merge it.

4. Make a release note about the new release on GitHub. Check the [Release Notes](#release-notes) section for detailed instruction.

5. Switch to the main branch and make sure the code is up to date by running the following command:

   ```
   git checkout main
   git pull
   ```

6. Make sure all dependencies have been installed by running the following command:

   ```
   yarn
   ```

7. Build the project with the following command and wait for the build to complete:

   ```
   yarn run build
   ```

8. Run the following command and log in with an npm account that has write access to the `ml5` package. You may be redirected to a browser window for authentication.

   ```
   npm login
   ```

9. Publish the package with the following command. You may be redirected to a browser window for authentication.

   ```
   npm publish --access public
   ```

10. The package should now be available at. (Replace `<version>` with the new SemVer set in step 1).

    ```
    https://unpkg.com/ml5@<version>/dist/ml5.js
    ```

11. Update the example code on the p5 web editor. Follow the instructions in the [Update p5 Web Editor Sketches](#update-p5-web-editor-sketches) section.

## Release Notes

ml5.js produce release notes alongside each new release. The release notes provides a brief overview of the changes, updates, and additions made to the ml5.js library. This section is a brief guide on generating release notes on GitHub.

1. Go to [ml5's Releases Page](https://github.com/ml5js/ml5-next-gen/releases) on Github.
2. Click on **Draft a new release**.
3. Click on **Choose a tag** and enter the version number of the new release in the format of `v<major>.<minor>.<patch>`. For example, `v1.0.3`.
4. Click on **Create new tag: vx.x.x on publish**.
5. For the **Target**, make sure `main` is selected.
6. For the **Previous tag**, select the previous release. For example, if the new release is `v1.0.3`, select tag `v1.0.2`.
7. Click on **Generate release notes**, and a release note will be automatically generated. If needed, make manual edits to the release note.
8. Make sure **Set as the latest release** is selected and click **Publish release**.
9. You just created a new release note!

## Unit Tests

To run the unit tests, run the following command:

```
yarn test
```

Currently, ml5 have a very limited number of unit tests. Tests is an area we are investigating, and we hope to improve it in the near future. We encourage anyone with experience or knowledge about unit tests to open an issue for discussion and contribution.

## Update p5 Web Editor Sketches

To update the p5 Web Editor sketches, first create a `.env` file with the following content:

```
  P5_USERNAME=<p5 web editor username here>
  P5_PASSWORD=<p5 web editor password here>
```

Then, run the following command:

```
yarn run upload-examples
```

The script will match the directory name of a local example sketch with the name of the sketch on the web editor. If a local directory name is the same as a sketch name on the web editor (case sensitive), the content of the sketch will be updated (with the sharing URL unchanged). If a local directory name is not found on the web editor, a new web editor sketch will be created. If a web editor sketch does not have a matching local directory name, the script will NOT automatically delete the web editor sketch. Any deletion should be done manually on the web editor.

Updating an existing sketch will not affect the collections on the p5 web editor. Newly uploaded sketches will not be automatically added to any collections.

Currently, this script cannot upload non-text files such as images or binaries. Those files that have not been uploaded will be listed and will require manual uploading.

## All Contributors

If you contributed to the project in any way, we would like to include you in our [contributors list in README.md](https://github.com/ml5js/ml5-next-gen?tab=readme-ov-file#contributors).

To add a new contributor, create a new branch from main. Then, enter the following command in the terminal:

```
yarn all-contributors add
```

Complete the instructions in the terminal. This will automatically update `README.md` and `.all-contributorsrc` files with the new contributor.

Make a pull request to merge the new branch into main. Once the branch gets merged, the new contributor will be listed!

## API Implementation Guideline

This guideline provides a high-level concept of what the ml5.js library's API should look like, serving as a reference to keep the ml5.js interface consistent and friendly.

### General Guidelines

1. ml5.js is a standalone library; however, ml5.js prioritizes compatibility with [p5.js library](https://p5js.org/).
2. All ml5.js functions called by the user are defined with "camelCase".

3. All ml5.js model objects are instantiated with a factory function with the style `ml5.<modelName>`. For example:

   ```javascript
   let bodyPose = ml5.bodyPose("BlazePose");
   let neuralNetwork = ml5.neuralNetwork();
   ```

4. The factory functions `ml5.<modelName>` should support p5.js's `preload()` as well as the callback interface. The factory functions should synchronously return an unready instance of the ml5.js model object. When the model becomes ready, the factory functions should call the callback function with the (now ready) instance of the object and also signal p5.js if `preload()` function is present.

5. When a string parameter or option is passed into any ml5.js function as a configuration setting, it is matched case _insensitively_. For example, the following calls produce the same result:

   ```javascript
   let bodyPose = ml5.bodyPose("BlazePose", { modelType: "Full" });
   ```

   ```javascript
   let bodyPose = ml5.bodyPose("blazepose", { modelType: "full" });
   ```

6. When possible, parameters and options should be optional and have default values in lieu of user definition.

7. ml5.js should throw a friendly warning when the user passes in an invalid parameter or option, and proceed with the default value when possible. For example:
   ```javascript
   let bodyPose = ml5.bodyPose({ modelType: "foo" });
   // Console:
   // 🟪ml5.js warns: The 'modelType' option for bodyPose has to be set to 'lite', 'full', or 'heavy', but it is being set to 'foo' instead.
   //
   // ml5.js is using default value of 'full'.
   ```
8. An ml5.js function should be able to accept parameters in any order when possible. For example, the following calls produce the same result:

   ```javascript
   let bodyPose = ml5.bodyPose("blazepose", { modelType: "full" });
   ```

   ```javascript
   let bodyPose = ml5.bodyPose({ modelType: "full" }, "blazepose");
   ```

9. Asynchronous ml5.js functions should use the callback interface.
   **Note**: Currently, some ml5.js functions also provides the promise/async await interface. However, ml5.js does not officially support the promise/async await interface. We are considering fully supporting the promise/async await interface in the future and will follow [p5.js](https://p5js.org/)'s lead.

10. ml5.js should call the callback functions with the pattern `callback(result, error)`.

### Image/Video-Based Detection Models

1. For image-based detection models, `ml5.<modelName>` should accept 3 optional parameters, `modelName`, `options`, and `modelReady`.

- **modelName**: A string, case insensitively specify the underlying model to use.
- **options**: An object, specifies configuration setting for the ml5.js model.
- **modelReady**: A callback function that is called when the underlying model is ready. An instance of ml5.js model is passed into the its first parameter no error occurs. Otherwise, an error object is pass into the second parameter.

## Utils

This section documents the utility functions found in the `src/utils` folder.

### [handleOptions](src\utils\handleOptions.js)

`handleOptions` is a function that filters a user defined options object based on rules in a mold object, returning a filtered options object. The function logs friendly warnings in the console when one of the user defined options violates the rules.

```js
const filteredOptions = handleOptions(userObject, moldObject);
```

#### `userObject`

The `userObject` is an object defined by the user to configure the options of a model. For example, the below object configures the `handpose` model to detect a maximum of 4 hands using the "full" variant:

```js
const optionsObject = {
  maxHands: 4,
  modelType: full,
};
```

#### `moldObject`

Inspired by [Mongoose Models](https://mongoosejs.com/docs/models.html), the `moldObject` defines how the `userObject` should be filtered. Here is an example `optionsObject`:

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

This particular `moldObject` allows the user to have a `maxHands` option with a minimum value of 1, a `runtime` option with the value of either `mediapipe` or `tfjs`, and a `modelType` option with the value of either `lite` or `full`.

#### Define a Rule in `moldObject`

The `moldObject` consists of key-value pairs. The key defines the name of an allowed option, and the value is an object that contains rules on how the option should be filtered. Here are the rules:

- `type` (required): A string defining the correct type, can be `"number"`, `"enum"`, `"boolean"`, `"string"`, `"object"`, or `"undefined"`.
- `default` (required): The default value in case the user does not provide a value or provides an erroneous value for the option.
- `ignore` (optional): A boolean defining whether the key should be ignored. Defaults to false. Useful when set to a dynamically evaluated value (see section below).
- `alias` (optional): A string defining an alternative name for this option.
- Specifically for `type: "number"`:
  - `min` (optional): A number defining the minimum value.
  - `max` (optional): A number defining the maximum value.
  - `integer` (optional): A boolean defining whether the value should be an integer. Defaults to `false`.
  - `multipleOf` (optional): A number. When defined, the user value must be a multiple of this number.
- Specifically for `type: "enum"`:
  - `enums` (required): An array defining a list of valid values.
  - `caseInsensitive` (optional): A boolean defining whether to checks the user value against the enum list case-insensitively. Defaults to `true`.

#### Functions As Rules

A rule can be a constant value or a function that is dynamically evaluated. The function will be called with the current filtered object as its parameter. Below is an example usage:

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
    default: (filteredObject) => filteredObject.runtime === "mediapipe" ? 4 : 2;
  },
};
```

When the user sets the runtime to `mediapipe`, the default value of `maxHands` is `4`, and when the user sets the runtime to `tfjs`, the default `maxHands` is `2`.

**Caveat:** the options gets processed from top to bottom in the order defined in the `moldObject`, and the `filteredObject` only contains the options that has already been processed. Thus, `runtime` must be placed above `maxHands` in the `moldObject` for the function to work properly.
