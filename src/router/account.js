var jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = ({ router, models }) => {
  const { Account, ExpenseType } = models;

  router.post("/account/create", async (ctx) => {
    const { account, typeId, date, remark } = ctx.request.body;
    const token = ctx.cookies.get("identify_token");
    const userInfo = jwt.verify(token, "secret");
    const value = await ExpenseType.findOne({
      where: {
        id: typeId,
      },
    });

    await Account.create({
      account,
      type: value.type,
      typeId,
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
    const { startTime, endTime } = ctx.query;
    const list = await Account.findAll({
      where: {
        userId: userInfo.userId,
        date: {
          [Op.between]: [startTime, endTime],
        },
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
      return +item.account + sum;
    }, 0);

    ctx.body = {
      message: "ok",
      success: true,
      body: { total: Math.trunc(total) },
    };
  });

  router.get("/account/getDateList", async (ctx) => {
    const token = ctx.cookies.get("identify_token");
    const userInfo = jwt.verify(token, "secret");
    const list = await Account.findAll({
      where: {
        userId: userInfo.userId,
      },
    });

    const dateMap = new Map()
    list.forEach(item => {
      const date = item.date.split('-')
      const key = `${date[0]}-${date[1]}`
      const value = dateMap.get(key) || 0
      dateMap.set(key, value + +item.account)
    });

    const dateList = []

    for (let item of dateMap.entries()) {
      dateList.push({
        date: item[0],
        sum: item[1],
      })
    }

    ctx.body = {
      message: "ok",
      success: true,
      body: { list: dateList },
    };
  });
};
