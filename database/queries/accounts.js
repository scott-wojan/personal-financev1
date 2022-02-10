/**
 * @file Defines the queries for the accounts table/views.
 */

import db from "../index";

const saveAccounts = async (userId, access_token, institutionId, accounts) => {
  const pendingQueries = accounts.map(async (account) => {
    const query = {
      // RETURNING is a Postgres-specific clause that returns a list of the inserted items.
      text: `
        INSERT INTO accounts
          (
            id,
            access_token,
            name,
            mask,
            official_name,
            current_balance,
            available_balance,
            iso_currency_code,
            account_limit,
            type,
            subtype,
            user_id,
            institution_id
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT
          (id)
        DO UPDATE SET
          current_balance = $6,
          available_balance = $7,
          access_token = $2
      `,
      values: [
        account.account_id,
        access_token,
        account.name,
        account.mask,
        account.official_name,
        account.balances.current,
        account.balances.available,
        account.balances.iso_currency_code,
        account.account_limit ?? null,
        account.type,
        account.subtype,
        userId,
        institutionId,
      ],
    };

    try {
      const client = await db.connect();
      await client.query(query);
      client.release();
      return;
    } catch (error) {
      console.log(error.stack);
    }
  });
  return await Promise.all(pendingQueries);
};

/**
 * Removes users and related items, accounts and transactions.
 *
 *
 * @param {string[]} userId the desired user to be deleted.
 */
const deleteAccount = async (userId) => {
  const query = {
    text: "DELETE FROM users_table WHERE id = $1;",
    values: [userId],
  };
  await db.query(query);
};

/**
 * gets a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const getAllAccountsByUser = async (userId) => {
  const query = {
    text: "SELECT * FROM accounts WHERE user_id = $1",
    values: [userId],
  };
  const { rows } = await db.query(query);
  return rows;
};

/**
 * gets a single account for a user.
 *
 * @param {number} userId the ID of the user.
 * @param {number} accountId the ID of the account.
 * @returns {Object} an account.
 */
const getAccountByUser = async (userId, accountId) => {
  const query = {
    text: "SELECT * FROM accounts WHERE user_id = $1 and account_id = $2",
    values: [userId, accountId],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export { saveAccounts, deleteAccount, getAllAccountsByUser, getAccountByUser };
