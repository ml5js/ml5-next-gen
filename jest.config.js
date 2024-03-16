/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  globalSetup: "./setupTests.js",
  passWithNoTests: true,
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    resources: "usable", // Load image resources
  },
  resetMocks: true
};

module.exports = config;
