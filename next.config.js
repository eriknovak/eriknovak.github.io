const path = require("path");

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  assetPrefix: process.env.BASE_PATH || "",
  publicRuntimeConfig: {
    basePath: process.env.BASE_PATH || "",
  },
  trailingSlash: true,
};
