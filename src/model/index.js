const user = require("./user");
const account = require("./account");
const expenseType = require("./expenseType");

module.exports = (sequelize) => ({
  User: user({ sequelize }),
  Account: account({ sequelize }),
  ExpenseType: expenseType({ sequelize }),
});
