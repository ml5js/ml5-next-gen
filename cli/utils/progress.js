/**
 * cli/utils/progress.js
 *
 * Quiet-aware logging helper. Errors are thrown by callers instead of routed
 * through this helper, so `--quiet` suppresses progress without hiding failures.
 */

function log(message, quiet) {
  if (!quiet) console.log(message);
}

module.exports = { log };
