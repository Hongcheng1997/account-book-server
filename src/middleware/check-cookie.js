const jwt = require("jsonwebtoken");

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.url !== "/user/login") {
      const token = ctx.cookies.get("identify_token");
      try {
        jwt.verify(token, "secret");
        await next();
      } catch (error) {
        ctx.throw(401, error);
      }
    } else {
      await next();
    }
  };
};
