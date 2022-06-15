const user = require("./user");
const account = require("./account");

module.exports = (sequelize) => ({
  User: user({ sequelize }),
  Account: account({ sequelize }),
});
