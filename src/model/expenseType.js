const { DataTypes } = require("sequelize");

module.exports = ({ sequelize }) => {
    return sequelize.define("expenseType", {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fid: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
};
