/**
 * @file Defines the queries for the accounts table/views.
 */

import db from "../index";

/**
 * Creates or updates an institution.
 *
 * @param {Object} institution the institution.
 * @returns {Object} the saved institution.
 */
const saveInstitution = async (institution) => {
  if (!institution) return null;
  const query = {
    text: `
    INSERT INTO institutions
      (
        id,
        name,
        url,
        primary_color,
        logo
      )
    VALUES
      ($1, $2, $3, $4, $5)
    ON CONFLICT
      (id)
    DO UPDATE SET
      name=$2,
      url=$3,
      primary_color=$4,
      logo=$5
    RETURNING
      *
  `,
    values: [
      institution.institution_id,
      institution.name ?? null,
      institution.url ?? null,
      institution.primary_color ?? null,
      institution.logo ?? null,
    ],
  };
  try {
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  }
};

/**
 * gets a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const associateInstitutionToUser = async (
  itemId,
  institutionId,
  userId,
  access_token
) => {
  const query = {
    text: "INSERT INTO user_institutions(item_id, user_id, institution_id, access_token) VALUES ($1, $2, $3, $4)",
    values: [itemId, userId, institutionId, access_token],
  };

  try {
    const { rows } = await db.query(query);
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  }
};

/**
 * gets a single account.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const getAllInstitutionsByUser = async (userId) => {
  const query = {
    text: "SELECT * FROM accounts WHERE id = $1",
    values: [userId],
  };
  const { rows } = await db.query(query);
  // since the user IDs are unique, this query will return at most one result.
  return rows[0];
};

export {
  saveInstitution,
  getAllInstitutionsByUser,
  associateInstitutionToUser,
};

export {};
