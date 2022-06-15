const user = require("./user");
const account = require("./account");

module.exports = ({ router, models }) => {
  user({ router, models });
  account({ router, models });
};
