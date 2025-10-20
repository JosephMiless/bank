'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //rename wallets to bank accounts
    await queryInterface.renameTable('Wallets', 'BankAccounts')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable('BankAccounts', 'Wallets')
  }
};
