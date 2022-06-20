module.exports = {
  port: 3000,
  mysql: {
    username: process.env.USERNAME || "root",
    password: process.env.PASSWORD || null,
    database: process.env.DATABASE || "sequelize-example",
    host: "localhost",
    dialect: "mysql",
  },
};
