'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BankAccounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        defaultValue: Sequelize.UUIDV4
      },
      userID: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {model: "Users", key: "id"},
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      bankName: {
        type: Sequelize.STRING,
        accountNumber: Sequelize.STRING,
        unique:true
      },
      accountType: {
        type: Sequelize.ENUM('savings', 'checking')
      },
      balance: {
        type: Sequelize.DECIMAL,
        defaultValue: 0.00
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: "USD"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BankAccounts');
  }
};