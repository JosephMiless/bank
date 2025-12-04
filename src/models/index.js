import { sequelize } from "../config/sequelize.js";
import { User } from "./user.js";
import { BankAccount } from "./bankAccount.js";
import { Transaction } from "./transaction.js";

// 🔗 Associations

// A user can have many bank accounts
      User.hasMany(BankAccount, {
        foreignKey: "userID",
        as: "bankAccounts",
      });

      BankAccount.belongsTo(User, { foreignKey: "userID", as: "user" });

// A bank account can have many transactions
       BankAccount.hasMany(Transaction, {
        foreignKey: 'sourceAccount',
        as: 'outgoingtransactions'
      });
      BankAccount.hasMany(Transaction, {
        foreignKey: 'destinationAccount',
        as: 'incomingtransactions'
      });
      
      Transaction.belongsTo(BankAccount, {
        foreignKey: 'sourceAccount',
        as: 'senderAccount',
      });

      Transaction.belongsTo(BankAccount, {
        foreignKey: 'destinationAccount',
        as: 'receiverAccount'
      });

// 🔄 Sync all models
export const initDB = async () => {
  try {

    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");

    // await sequelize.sync({}); // use { force: true } for fresh start
    // console.log("✅ Database synced successfully!");

  } catch (error) {
    console.error("❌ Database sync/connection failed:", error);
  }
};

export { User, BankAccount, Transaction };





// 'use strict';

// const fs = require('fs');
// const path = require('path');
// const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
// const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + './config/database.js')[env];
// const db = {};

// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }

// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// module.exports = db;
