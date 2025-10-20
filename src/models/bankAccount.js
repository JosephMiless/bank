import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export class BankAccount extends Model {}

BankAccount.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
      references: { model: "Users", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    bankName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    accountType: {
      type: DataTypes.ENUM("savings", "checking"),
      allowNull: false,
    },
    balance: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USD",
    },
  },
  {
    sequelize,
    modelName: "BankAccount",
    tableName: "BankAccounts",
  }
);




// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class BankAccount extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // wallet belongs to a user
//       BankAccount.belongsTo(models.User, {
//         foreignKey: 'userID',
//         as: 'user'
//       });

//       BankAccount.hasMany(models.Transaction, {
//         foreignKey: 'sourceAccount',
//         as: 'outgoingtransactions'
//       });
//       BankAccount.hasMany(models.Transaction, {
//         foreignKey: 'destinationAccount',
//         as: 'incomingtransactions'
//       });

//     }
//   }
//   BankAccount.init({
//     bankName: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'BankAccounts',
//   });
//   return BankAccount;
// };