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

## All Contributors

If you contributed to the project in any way, we would like to include you in our [contributors list in README.md](https://github.com/ml5js/ml5-next-gen?tab=readme-ov-file#contributors).

To add a new contributor, create a new branch from main. Then, enter the following command in the terminal:

```
yarn all-contributors add
```

Complete the prompts in the terminal.

Make a pull request to merge the new branch into main. When the branch gets merged, the new contributor will show up in README.md!
