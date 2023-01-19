const jwt = require("jsonwebtoken");

const whiteList = ['/user', '/expenseType']

module.exports = () => {
  return async (ctx, next) => {
    if (!whiteList.find((url) => ctx.url.includes(url))) {
      const token = ctx.cookies.get("identify_token");
      try {
        jwt.verify(token, "secret");
        await next();
      } catch (error) {
        console.log(error)
        ctx.status = 401;
        ctx.body = {
          message: '登陆已过期',
          success: false,
        }
      }
    } else {
      await next();
    }
  };
};
