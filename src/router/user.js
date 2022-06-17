var jwt = require("jsonwebtoken");

module.exports = ({ router, models }) => {
  const { User } = models;

  router.post("/user/login", async (ctx) => {
    const { userName, password } = ctx.request.body;
    if (!userName) {
      ctx.throw(400, "firstName required");
      return;
    }
    if (!password) {
      ctx.throw(400, "password required");
      return;
    }
    const [user, created] = await User.findOrCreate({
      where: { userName },
      defaults: {
        password: "123456",
      },
    });
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    const token = jwt.sign({ userId: user.id, exp }, "secret");

    if (user.password !== password) {
      ctx.body = {
        message: "密码错误",
        success: false,
      };
      return;
    }
    ctx.cookies.set("identify_token", token, {
      expires: new Date(exp * 1000),
    });
    ctx.body = {
      message: "ok",
      success: true,
      body: { created },
    };
  });
};
