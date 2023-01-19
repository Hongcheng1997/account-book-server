const { DataTypes } = require("sequelize");

// 餐饮 1
// 下馆子、超市购物、奶茶、三餐

// 出行 2
// 打车、高铁、飞机

// 购物 3
// 衣服、网购、送礼

// 娱乐 4
// 电影、麻将

// 住宿 5
// 房租、水电、酒店

// 转账 6
// 家庭支出、借款、其他

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
  });
};
