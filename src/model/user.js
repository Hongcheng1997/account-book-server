const { DataTypes } = require("sequelize");

module.exports = ({ sequelize }) => {
  return sequelize.define("user", {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
