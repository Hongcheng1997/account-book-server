const { DataTypes } = require("sequelize");

module.exports = ({ sequelize }) => {
  return sequelize.define("account", {
    account: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ftype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
