#!/usr/bin/env node

require("../cli")(process.argv.slice(2)).catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
