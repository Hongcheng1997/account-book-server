var jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = ({ router, models }) => {
  const { Account } = models;

  router.post("/account/create", async (ctx) => {
    const { account, type, date, remark } = ctx.request.body;
    const token = ctx.cookies.get("identify_token");
    const userInfo = jwt.verify(token, "secret");
    await Account.create({
      account,
      type,
      date,
      userId: userInfo.userId,
      remark,
    });

    ctx.body = {
      message: "ok",
      success: true,
    };
  });

  router.get("/account/list", async (ctx) => {
    const token = ctx.cookies.get("identify_token");
    const userInfo = jwt.verify(token, "secret");
    const list = await Account.findAll({
      where: {
        userId: userInfo.userId,
      },
      order: [["date", "DESC"]],
    });

    ctx.body = {
      message: "ok",
      success: true,
      body: list,
    };
  });

  router.get("/account/getTotalAmount", async (ctx) => {
    const token = ctx.cookies.get("identify_token");
    const userInfo = jwt.verify(token, "secret");
    const { startTime, endTime } = ctx.query;
    const list = await Account.findAll({
      where: {
        userId: userInfo.userId,
        date: {
          [Op.between]: [startTime, endTime],
        },
      },
    });

    const total = list.reduce((sum, item) => {
      return item.account + sum;
    }, 0);

    ctx.body = {
      message: "ok",
      success: true,
      body: { total },
    };
  });
};
