const jwt = require("jsonwebtoken");

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.url !== "/user/login") {
      const token = ctx.cookies.get("identify_token");
      try {
        jwt.verify(token, "secret");
        await next();
      } catch (error) {
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
