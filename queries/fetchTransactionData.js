import axios from "axios";

export const fetchTransactionData = async (
  page,
  pageSize,
  accountId,
  startDate,
  endDate
) => {
  const offset = page * pageSize;
  //
  try {
    const response = await axios.post("/api/transactions", {
      offset,
      limit: pageSize,
      accountId,
      startDate,
      endDate,
      page,
    });

    const data = await response;
    return data.data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};
