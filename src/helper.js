const fs = require("fs");
const path = require("path");
const _defaultsDeep = require("lodash/defaultsDeep");

const getConfig = () => {
  const defaultConfig = require("./config/config.default.js");
  const localConfig = path.resolve(__dirname, "./config/config.local.js");
  if (fs.existsSync(localConfig)) {
    return _defaultsDeep(require(localConfig), defaultConfig);
  }
  return defaultConfig;
};

const config = getConfig();

module.exports = {
  config,
};
