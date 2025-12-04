'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // 1. Add the correct value to the existing ENUM
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Transactions_category"
      ADD VALUE IF NOT EXISTS 'transfer';
    `);

    // 2. Rebuild a clean ENUM without the misspelled value
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Transactions_category_new" 
        AS ENUM('deposit', 'withdrawal', 'transfer');

      ALTER TABLE "Transactions"
        ALTER COLUMN category
        TYPE "enum_Transactions_category_new"
        USING category::text::"enum_Transactions_category_new";

      DROP TYPE "enum_Transactions_category";

      ALTER TYPE "enum_Transactions_category_new"
        RENAME TO "enum_Transactions_category";
    `);
  },

  async down(queryInterface, Sequelize) {
    // Reverse the change (also without update)
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Transactions_category"
      ADD VALUE IF NOT EXISTS 'transfrer';
    `);

    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Transactions_category_old" 
        AS ENUM('deposit', 'withdrawal', 'transfrer');

      ALTER TABLE "Transactions"
        ALTER COLUMN category
        TYPE "enum_Transactions_category_old"
        USING category::text::"enum_Transactions_category_old";

      DROP TYPE "enum_Transactions_category";

      ALTER TYPE "enum_Transactions_category_old"
        RENAME TO "enum_Transactions_category";
    `);
  }
};
