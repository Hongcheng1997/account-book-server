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
    const token = jwt.sign(
      { userId: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60 },
      "secret"
    );

    if (created) {
      ctx.body = {
        message: "ok",
        status: 200,
        body: `${token}`,
      };
    } else {
      if (user.password === password) {
        ctx.body = {
          message: "ok",
          status: 200,
          body: `${token}`,
        };
      } else {
        ctx.body = {
          message: "password err",
          status: 500,
        };
      }
    }
  });
};
