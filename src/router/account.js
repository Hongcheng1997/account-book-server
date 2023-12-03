var jwt = require("jsonwebtoken");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;

module.exports = ({ router, models }) => {
  const { Account, ExpenseType } = models;

  router.post("/account/create", async (ctx) => {
    const { account, typeId, date, remark } = ctx.request.body;
    // const token = ctx.cookies.get("identify_token");
    // const userInfo = jwt.verify(token, "secret");
    const type = await ExpenseType.findOne({
      where: {
        id: typeId,
      },
    });
    const ftype = await ExpenseType.findOne({
      where: {
        id: type.fid,
      },
    });

    if (!type.fid) {
      ctx.body = {
        message: "none",
        success: false,
      };
      return
    }

    await Account.create({
      account,
      type: type.type,
      ftype: ftype.type,
      fid: type.fid,
      typeId,
      date,
      userId: 1,
      // userId: userInfo.userId,
      remark,
    });

    ctx.body = {
      message: "ok",
      success: true,
    };
  });

  router.get("/account/list", async (ctx) => {
    // const token = ctx.cookies.get("identify_token");
    // const userInfo = jwt.verify(token, "secret");
    const { startTime, endTime } = ctx.query;
    let list = []
    if (startTime && endTime) {
      list = await Account.findAll({
        where: {
          // userId: userInfo.userId,
          userId: 1,
          date: {
            [Op.between]: [startTime, endTime],
          },
        },
        order: [["date", "DESC"]],
      });
    } else {
      list = await Account.findAll({
        where: {
          // userId: userInfo.userId,
          userId: 1,
        },
        order: [["date", "DESC"]],
      });
    }

    ctx.body = {
      message: "ok",
      success: true,
      body: list,
    };
  });

  router.get("/account/getTotalAmount", async (ctx) => {
    // const token = ctx.cookies.get("identify_token");
    // const userInfo = jwt.verify(token, "secret");
    const { startTime, endTime } = ctx.query;
    const list = await Account.findAll({
      where: {
        userId: 1,
        date: {
          [Op.between]: [new Date(startTime), new Date(endTime)],
        },
      },
    });
    const lastTime = await Account.findOne({
      order: [['date', 'DESC']],
    });

    const total = list.reduce((sum, item) => {
      return +item.account + sum;
    }, 0);

    ctx.body = {
      message: "ok",
      success: true,
      body: { total: Math.trunc(total), lastTime: +new Date(lastTime.date) + 1000*60*60*24 },
    };
  });

  router.get("/account/getDateList", async (ctx) => {
    // const token = ctx.cookies.get("identify_token");
    // const userInfo = jwt.verify(token, "secret");
    const list = await Account.findAll({
      where: {
        userId: 1,
      },
    });

    const dateMap = {}
    list.forEach(item => {
      const date = item.date.split('-')
      const key = `${date[0]}-${date[1]}`
      if (!dateMap[key]) dateMap[key] = {}
      const value = dateMap[key]['sum'] || 0
      // dateMap.set(key, value + +item.account)
      dateMap[key]['sum'] = value + +item.account
      // 房租
      if (+item.typeId === 19) {
        dateMap[key]['rent'] = +item.account
      } else if (+item.typeId === 35) {
        // 车贷
        dateMap[key]['carloan'] = +item.account
      } else {
        const dailySum = dateMap[key]['dailySum'] || 0
        dateMap[key]['dailySum'] = dailySum + +item.account
      }
    });

    const dateList = []
    const keys = Object.keys(dateMap)
    keys.forEach(key => {
      const item = dateMap[key]
      dateList.push({
        date: key,
        sum: item.sum,
        rent: item.rent,
        carloan: item.carloan,
        dailySum: item.dailySum,
      })
    })

    ctx.body = {
      message: "ok",
      success: true,
      body: { list: dateList },
    };
  });

  router.get("/account/updateTypeName", async (ctx) => {
    const list = await Account.findAll();
    const typeList = await ExpenseType.findAll();
    const typeMap = new Map()
    // typeList.forEach(type => typeMap.set(type.id, type.fid))
    // typeList.forEach(type => typeMap.set(type.id, type.type))
    typeList.forEach(type => typeMap.set(type.id, type.type))

    list.forEach(async item => {
      await Account.update({ ftype: typeMap.get(item.fid) }, {
        where: {
          typeId: item.typeId
        }
      });
      // const type = typeMap.get(item.typeId)
      // if (item.type !== type) {
      //   await Account.update({ type }, {
      //     where: {
      //       typeId: item.typeId
      //     }
      //   });
      // }


      //   const fid = typeMap.get(item.typeId)
      //   if (!fid) console.log(item.type)
      //   if (item.typeId === 1) {
      //     await Account.update({ typeId: 10, type: "三餐" }, {
      //       where: {
      //         typeId: item.typeId
      //       }
      //     });
      //   }
      //   if (item.typeId === 2) {
      //     await Account.update({ typeId: 11, type: "打车" }, {
      //       where: {
      //         typeId: item.typeId
      //       }
      //     });
      //   }
      //   if (item.typeId === 30) {
      //     await Account.update({ typeId: 32, type: "充电" }, {
      //       where: {
      //         typeId: item.typeId
      //       }
      //     });
      //   }
      //   if (item.typeId === 3) {
      //     await Account.update({ typeId: 15, type: "网购" }, {
      //       where: {
      //         typeId: item.typeId
      //       }
      //     });
      //   }
    })
  })
};
