/**
 * cli/utils/size.js
 *
 * Tiny human-readable byte formatter for CLI progress and diagnostics.
 */

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

module.exports = { formatBytes };
