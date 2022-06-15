const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
const { config } = require("./helper");
const routers = require("./router");
const getModels = require("./model");

const { username, password, host, port, ssl, database, dialect } = config.mysql;

async function getConn() {
  try {
    const conn = await mysql.createConnection({
      host,
      user: username,
      password,
      port,
      ssl,
      multipleStatements: true,
      database: null,
      Promise,
    });
    return conn;
  } catch (e) {
    // log.error("connect mysql server fail!");
    throw e;
  }
}

async function createDataBaseIfNotExists() {
  const connection = await getConn();
  try {
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
  } catch (e) {
    // log.error(`createDataBaseIfNotExists error: ${e}`);
    throw e;
  } finally {
    connection.end();
  }
}

module.exports = async (router) => {
  await createDataBaseIfNotExists();

  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect,
  });

  const models = getModels(sequelize);
  await sequelize.sync({ force: false });
  routers({ router, models });
};
