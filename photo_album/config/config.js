require("dotenv").config();

const config = {
  development: {
    username: process.env.DB_USERNAME_DEV,
    password: "riska2206",
    database: "photo_album",
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
  },
  test: {
    username: "postgres",
    password: "riska2206",
    database: "photo_album_test",
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};

module.exports = config;
