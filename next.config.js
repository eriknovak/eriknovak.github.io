const path = require("path");

module.exports = {
  output: 'export',
  distDir: 'frontend',
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  assetPrefix: process.env.BASE_PATH || "",
  trailingSlash: true,
};
