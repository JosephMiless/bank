import { config } from "./env.js";

export default {
  development: {
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres"
  },

  production: {
    username: config.db.user,
    password: config.db.pass,
    database: config.db.name,
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
          require: true,
        rejectUnauthorized: false,
      }
    }
  }
};