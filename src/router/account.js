var jwt = require("jsonwebtoken");

module.exports = ({ router, models }) => {
  const { Account } = models;

  router.post("/account/create", async (ctx) => {
    const { account, type, date } = ctx.request.body;
    const token = ctx.cookies.get("identify_token");
    try {
      const userInfo = jwt.verify(token, "secret");
      await Account.create({
        account,
        type,
        date,
        userId: userInfo.userId,
      });

      ctx.body = {
        message: "ok",
        success: true,
      };
    } catch (error) {
     if (error.expiredAt) {
       ctx.throw(401, "登陆已过期");
     } else {
       ctx.throw(500, "unkown error");
     }
    }
  });

  router.get("/account/list", async (ctx) => {
    const token = ctx.cookies.get("identify_token");
    try {
      const userInfo = jwt.verify(token, "secret");
      const list = await Account.findAll({
        where: { userId: userInfo.userId },
      });

      ctx.body = {
        message: "ok",
        success: true,
        body: list,
      };
    } catch (error) {
      if (error.expiredAt) {
        ctx.throw(401, "登陆已过期");
      } else {
        ctx.throw(500, "unkown error");
      }
    }
  });
};
