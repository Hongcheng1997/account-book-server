const Koa = require("koa");
const Router = require("koa-router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const { config } = require("./helper");
const initDataBase = require("./initDataBase");
const cors = require("koa2-cors");
const checkCookie = require("./middleware/check-cookie");
const app = new Koa();

app.use(bodyParser());

initDataBase(router);

app.use(cors({ credentials: true }));

// app.use(checkCookie());

app.use(router.routes()).use(router.allowedMethods());

app.listen(config.port, () => {
  console.log(`\nlisten port ${config.port}`);
});

console.log(process.env, "process.env");
