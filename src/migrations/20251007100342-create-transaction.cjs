'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      sourceAccount: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: 'BankAccounts', key: 'id'}
      },
      destinationAccount: {
        type: Sequelize.STRING,
        references: { model: 'BankAccounts', key: 'id'}
      },
      recipientEmail: {
        type: Sequelize.STRING
      },
      note: {
        type: Sequelize.STRING
      },
      amount: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('processing', 'successful', 'failed'),
        defaultValue: 'processing'
      },
      category:{
        type: Sequelize.ENUM('deposit', 'withdrawal', 'transfrer')
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
    await queryInterface.dropTable('Transactions');
  }
};