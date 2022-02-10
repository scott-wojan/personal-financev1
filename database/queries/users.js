/**
 * @file Defines the queries for the users table/views.
 */

import db from "../index";

/**
 * Creates a single user.
 *
 * @param {string} email the username of the user.
 * @returns {Object} the new user.
 */
const createUser = async (email) => {
  const query = {
    text: "INSERT INTO users (email) VALUES ($1) RETURNING *;",
    values: [email],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

/**
 * gets a single user.
 *
 * @param {number} userId the ID of the user.
 * @returns {Object} a user.
 */
const getUserById = async (userId) => {
  const query = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [userId],
  };
  const { rows } = await db.query(query);
  // since the user IDs are unique, this query will return at most one result.
  return rows[0];
};

/**
 * gets a single user.
 *
 * @param {string} email the email to search for.
 * @returns {Object} a single user.
 */
const getUserByEmail = async (email) => {
  const query = {
    text: "SELECT * FROM users WHERE email = $1",
    values: [email],
  };
  const { rows: users } = await db.query(query);
  return users[0];
};

/**
 * gets all users.
 *
 * @returns {Object[]} an array of users.
 */
const getAllUsers = async () => {
  const query = {
    text: "SELECT * FROM users",
  };
  const { rows: users } = await db.query(query);
  return users;
};

export { createUser, getUserById, getUserByEmail };
