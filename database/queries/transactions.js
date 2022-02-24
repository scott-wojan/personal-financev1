import { Database } from "../index";

const saveTransactions = async (transactions) => {
  const _db = new Database();

  const pendingQueries = transactions.map(async (transaction) => {
    let category, categorySub, categoryDetail;

    if (transaction.category?.length > 0) {
      category = transaction.category[0];
    }
    if (transaction.category?.length > 1) {
      categorySub = transaction.category[1];
    }

    const query = {
      text: `
        INSERT INTO transactions
          (
            id,	
            account_id,
            amount,
            iso_currency_code,
            category_id,
            check_number,
            date,
            authorized_date,
            address,
            city,
            region,
            postal_code,
            country,
            lat,
            lon,
            store_number,
            name,
            merchant_name,
            payment_channel,
            is_pending,
            type,
            category,
            subcategory,
            transaction_code
          )
        VALUES
          ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        ON CONFLICT
          (id)
        DO UPDATE SET
          account_id = $2,
          amount = $3,
          iso_currency_code = $4,
          category_id = $5,
          check_number = $6,
          date = $7,
          authorized_date = $8,
          address = $9,
          city = $10,
          region = $11,
          postal_code = $12,
          country = $13,
          lat = $14,
          lon = $15,
          store_number = $16,
          name = $17,
          merchant_name = $18,
          payment_channel = $19,
          is_pending = $20,
          type = $21,
          category = $22,
          subcategory = $23,
          transaction_code = $24
      `,
      values: [
        transaction.transaction_id,
        transaction.account_id,
        transaction.amount * -1, // in plaid positive values when money moves out of the account; negative values when money moves in. we are inverting this
        transaction.iso_currency_code,
        transaction.category_id ?? null,
        transaction.check_number ?? null,
        transaction.date,
        transaction.authorized_date ?? null,
        transaction.address ?? null,
        transaction.city ?? null,
        transaction.region ?? null,
        transaction.postal_code ?? null,
        transaction.country ?? null,
        transaction.lat ?? null,
        transaction.lon ?? null,
        transaction.store_number ?? null,
        transaction.name ?? null,
        transaction.merchant_name ?? null,
        transaction.payment_channel ?? null,
        transaction.is_pending ?? null,
        transaction.transaction_type,
        category,
        categorySub,
        transaction.transaction_code,
      ],
    };
    await _db.save(query.text, query.values);
  });

  try {
    await Promise.all(pendingQueries);
  } catch (error) {
    console.error(error);
  } finally {
    await _db.end();
  }
};

const getTransactions = async (user_id, page = 1) => {
  const _db = new Database();
  try {
    const rows = await _db.getAll(`select * from GetTransactions($1,$2)`, [
      user_id,
      page,
    ]);
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  } finally {
    await _db.end();
  }
};

const getTransactionsByDateRange = async (
  user_id,
  startdate,
  enddate,
  page = 0,
  offset = 0,
  limit = 10
) => {
  const _db = new Database();

  try {
    const rows = await _db.getFirst(
      `select * from GetTransactionsByDateRange($1,$2,$3,$4)`,
      [user_id, page, startdate, enddate]
    );
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  } finally {
    await _db.end();
  }
};

const getAccountTransactions = async (
  user_id,
  account_id,
  offset = 0,
  limit = 10
) => {
  const _db = new Database();
  try {
    const rows = await _db.getFirst(
      `select * from GetAccountTransactions($1,$2,$3)`,
      [user_id, account_id, page]
    );
    return rows;
  } catch (error) {
    console.log(error.stack);
  } finally {
    await _db.end();
  }
};

const getAccountTransactionsByDateRange = async (
  user_id,
  account_id,
  startdate,
  enddate,
  offset = 0,
  limit = 10
) => {
  const _db = new Database();
  try {
    const rows = await _db.getAll(
      `select * from get_account_transactions_by_daterange($1,$2,$3,$4,$5,$6)`,
      [user_id, account_id, startdate, enddate, offset, limit]
    );
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  } finally {
    await _db.end();
  }
};

/**
 * Removes one or more transactions.
 *
 * @param {string[]} transaction_ids.
 */
const deleteTransactions = async (transaction_ids) => {
  const _db = new Database();
  const pendingQueries = transaction_ids.map(async (transactionId) => {
    await _db.delete(`DELETE FROM transactions WHERE id = $1`, [transactionId]);
  });
  await Promise.all(pendingQueries);
};

export {
  saveTransactions,
  deleteTransactions,
  getTransactionsByDateRange,
  getTransactions,
  getAccountTransactions,
  getAccountTransactionsByDateRange,
};
