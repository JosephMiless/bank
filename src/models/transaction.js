import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/sequelize.js";

export class Transaction extends Model {}

Transaction.init(
  {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      sourceAccount: {
        type: DataTypes.STRING,
        references: { model: 'BankAccounts', key: 'id'}
      },
      destinationAccount: {
        type: DataTypes.STRING,
        references: { model: 'BankAccounts', key: 'id'}
      },
      recipientEmail: {
        type: DataTypes.STRING
      },
      note: {
        type: DataTypes.STRING
      },
      amount: {
        type: DataTypes.DECIMAL,
        allowNull: false
      },
      status: {
        type: DataTypes.ENUM('processing', 'successful', 'failed'),
        defaultValue: 'processing'
      },
      category:{
        type: DataTypes.ENUM('deposit', 'withdrawal', 'transfer')
      }
  },
  {
    sequelize,
    modelName: "Transaction",
  }
);




// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class Transaction extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {

//       Transaction.belongsTo(models.BankAccount, {
//         foreignKey: 'sourceAccount',
//         as: 'senderAccount',
//       });

//       Transaction.belongsTo(models.BankAccount, {
//         foreignKey: 'destinationAccount',
//         as: 'receiverAccount'
//       });

//     }
//   }
//   Transaction.init({
//     note: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'Transaction',
//   });
//   return Transaction;
// };