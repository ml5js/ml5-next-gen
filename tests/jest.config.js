/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: "<rootDir>/tests/coverage",
  coverageProvider: "v8",
  globalSetup: "<rootDir>/tests/testingUtils/setupTests.js",
  passWithNoTests: true,
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    resources: "usable", // Load image resources
  },
  resetMocks: true,
  rootDir: "..", // Set the rootDir to the project root so that transforms will apply to source code in /src
  roots: ["<rootDir>/tests/unit"] // Only run the unit tests
};

module.exports = config;
