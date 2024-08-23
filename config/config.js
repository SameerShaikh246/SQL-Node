require("dotenv").config({ path: `${process.cwd()}/.env` });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    seederStorage: "sequelize",
  },
  test: {
    username: "root",
    password: null,
    database: "ecommerce_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "ecommerce_production",
    host: "localhost",
    dialect: "postgres",
  },
};
