import db from "../index";

/**
 * gets an access token and institution_id for an item_id
 *
 * @param {number} item_id the ID of the item.
 * @returns {Object} an object with an access_key.
 */
const getDetailsByItemId = async (item_id) => {
  const query = {
    text: "select access_token, institution_id, user_id from user_institutions where item_id = $1",
    values: [item_id],
  };

  try {
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  }
};

export { getDetailsByItemId };
