'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove old constraints
    await queryInterface.removeConstraint('Transactions', 'Transactions_sourceAccount_fkey');
    await queryInterface.removeConstraint('Transactions', 'Transactions_destinationAccount_fkey');

    // 2. Re-add column with new constraints
    await queryInterface.changeColumn('Transactions', 'sourceAccount', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addConstraint('Transactions', {
      fields: ['sourceAccount'],
      type: 'foreign key',
      name: 'Transactions_sourceAccount_fkey',
      references: {
        table: 'BankAccounts',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });

    await queryInterface.changeColumn('Transactions', 'destinationAccount', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addConstraint('Transactions', {
      fields: ['destinationAccount'],
      type: 'foreign key',
      name: 'Transactions_destinationAccount_fkey',
      references: {
        table: 'BankAccounts',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Optional: reverse the constraints
    await queryInterface.removeConstraint('Transactions', 'Transactions_sourceAccount_fkey');
    await queryInterface.removeConstraint('Transactions', 'Transactions_destinationAccount_fkey');

    await queryInterface.changeColumn('Transactions', 'sourceAccount', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addConstraint('Transactions', {
      fields: ['sourceAccount'],
      type: 'foreign key',
      references: {
        table: 'BankAccounts',
        field: 'id'
      }
    });

    await queryInterface.changeColumn('Transactions', 'destinationAccount', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addConstraint('Transactions', {
      fields: ['destinationAccount'],
      type: 'foreign key',
      references: {
        table: 'BankAccounts',
        field: 'id'
      }
    });
  }
};
