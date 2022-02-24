import { getUserFromCookie } from "cookies/user";

import {
  getAccountTransactions,
  getAccountTransactionsByDateRange,
  getTransactions,
  getTransactionsByDateRange,
} from "database/queries/transactions";

export default async function handler(req, res) {
  const user = getUserFromCookie(req, res);
  const { accountId, startDate, endDate, page, pageSize } = req.body;
  const offset = page * pageSize;

  console.log("API Transactions", {
    userId: user.id,
    accountId,
    startDate,
    endDate,
    offset,
    page,
    pageSize,
  });

  try {
    if (!user) return res.status(401).json();
    let transactions = [];

    if (accountId) {
      transactions = await getAccountTransactionsForApi(
        startDate,
        endDate,
        user,
        accountId,
        offset,
        pageSize
      );
    } else {
      transactions = await getTransactionsForApi(
        startDate,
        endDate,
        user,
        offset,
        pageSize
      );
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(400).json(error.response);
  }
}
async function getTransactionsForApi(
  startDate,
  endDate,
  user,
  offset,
  pageSize
) {
  return startDate && endDate
    ? await getTransactionsByDateRange(
        user.id,
        startDate,
        endDate,
        offset,
        pageSize
      )
    : await getTransactions(user.id, offset);
}

async function getAccountTransactionsForApi(
  startDate,
  endDate,
  user,
  accountId,
  offset,
  pageSize
) {
  if (startDate && endDate) {
    return await await getAccountTransactionsByDateRange(
      user.id,
      accountId,
      startDate,
      endDate,
      offset,
      pageSize
    );
  }
  return getAccountTransactions(user.id, accountId);
  // return startDate && endDate
  //   ? await await getAccountTransactionsByDateRange(
  //       user.id,
  //       accountId,
  //       startDate,
  //       endDate,
  //       offset,
  //       pageSize
  //     )
  //   : await getAccountTransactions(user.id, accountId);
}
