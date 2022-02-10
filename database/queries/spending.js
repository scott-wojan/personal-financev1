import db, { getAll } from "../index";

/**
 * gets an access token and institution_id for an item_id
 *
 * @param {number} userId the ID of the user.
 * @param {number} startDate the date to start with.
 * @param {number} endDate the date to end with.
 * @returns {Object} an object with an access_key.
 */
const getSpendingByCategory = async (userId, startDate, endDate) => {
  return getAll("select * from GetSpendingByCategory($1, $2, $3)", [
    userId,
    startDate,
    endDate,
  ]);
};

export { getSpendingByCategory };
