# ml5-next-gen
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-0-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

Welcome to the next-generation repo for the ml5.js project! Due to the complexities inherent in updating all the dependencies in [the original repo](https://github.com/ml5js/ml5-library), we're exploring rebuilding from the ground up. This fresh repository allows us to migrate over classes and functions one at a time. This is very much a work in progress and is currently in its early, experimental stage. We appreciate your patience as we work towards refining this next evolution of the ml5.js project. Stay tuned!

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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!