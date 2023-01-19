const user = require("./user");
const account = require("./account");
const expenseType = require("./expenseType");

module.exports = ({ router, models }) => {
  user({ router, models });
  account({ router, models });
  expenseType({ router, models });
};
