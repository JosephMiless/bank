'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('BankAccounts', 'bankName', {
      type: Sequelize.STRING,
      unique: false,
      defaultValue: 'Horizon',
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('BankAccounts', 'bankName', {
      type: Sequelize.STRING,
      unique: false,
      defaultValue: null,
      allowNull: false
    })
  }
};
