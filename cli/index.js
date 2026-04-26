const { prefetch } = require("./prefetch");
const { list } = require("./list");
const { clear } = require("./clear");
const { verify } = require("./verify");
const { models } = require("./models");

function help() {
  console.log(`ml5 cache

Commands:
  ml5 cache prefetch <model>... [--runtime tfjs|mediapipe|both] [--variant <name>] [--out <dir>]
  ml5 cache list [--out <dir>]
  ml5 cache clear [model] [--out <dir>]
  ml5 cache verify <model> [--out <dir>]
  ml5 cache models
`);
}

module.exports = async function cli(args) {
  if (args.length === 0 || args.includes("--help") || args.includes("-h")) return help();
  if (args.includes("--version")) return console.log(require("../package.json").version);
  const [group, command, ...rest] = args;
  if (group !== "cache") return help();
  if (command === "prefetch") return prefetch(rest);
  if (command === "list") return list(rest);
  if (command === "clear") return clear(rest);
  if (command === "verify") return verify(rest);
  if (command === "models") return models(rest);
  return help();
};
