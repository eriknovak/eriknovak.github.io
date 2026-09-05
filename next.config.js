const path = require("path");

const basePath = process.env.BASE_PATH || "";

module.exports = {
  output: 'export',
  distDir: 'frontend',
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  // Expose the deploy prefix to client code (thumbnail and Link URLs).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
