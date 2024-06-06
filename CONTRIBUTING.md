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

## Unit Tests

To run the unit tests, run the following command

```
yarn test
```

## Making Releases

_This section is a temporary guide for contributors who wants to make a alpha release manually._

1. Create a new pull request on the main branch to update the SemVer number in `package.json`. For alpha releases, simply increment the trailing number in the SemVer. For example, `"version": "0.20.0-alpha.3"` should be changed to `"version": "0.20.0-alpha.4"`.

2. Merge the pull request.

3. Switch to the main branch and make sure the code is up to date by running the following command:

```
git checkout main
git pull
```

4. Make sure all dependencies have been installed by running the following command:

```
yarn
```

5. Build the project with the following command and wait for the build to complete:

```
yarn run build
```

6. Run the following command and log in with an npm account that has write access to the ml5 package. You may be redirected to a browser window for authentication.

```
npm login
```

7. Publish the package with the following command. You may be redirected to a browser window for authentication.

```
npm publish --tag alpha --access public
```

8. The package should now be available at. (Replace [version] with the new SemVer set in step 1).

```
   https://unpkg.com/ml5@[version]/dist/ml5.js
```

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

The script will match the directory name of a local example sketch with the name of the sketch on the web editor. If a local directory name is the same as a sketch name on the web editor (case sensitive), the content of the sketch will be updated (with the sharing URL unchanged). If a local directory name is not found on the web editor, a new web editor sketch will be created. If a web editor sketch does not have a matching local directory name, the script will not automatically delete the web editor sketch. Any deletion have to be done manually on the web editor.

Updating an existing sketch will not affect the collections on the p5 web editor. Newly uploaded sketches will not be automatically added to any collections.

Currently, this script cannot upload non-text files. Those files that have not been uploaded will be listed and will require manual uploading.

## All Contributors

If you contributed to the project in any way, we would like to include you in our [contributors list in README.md](https://github.com/ml5js/ml5-next-gen?tab=readme-ov-file#contributors).

To add a new contributor, create a new branch from main. Then, enter the following command in the terminal:

```
yarn all-contributors add
```

Complete the prompts in the terminal.

Make a pull request to merge the new branch into main. When the branch gets merged, the new contributor will show up in README.md!

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
