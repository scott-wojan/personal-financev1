import { database as settings } from "appconfig";
/**
 * @file Defines a connection to the PostgreSQL database, using environment
 * variables for connection information.
 */
const { Pool, types, Client } = require("pg");

// node-pg returns numerics as strings by default. since we don't expect to
// have large currency values, we'll parse them as floats instead.
types.setTypeParser(1700, (val) => parseFloat(val));

const config = {
  database: settings.name,
  host: settings.host,
  port: settings.port,
  user: settings.username,
  password: settings.password,
  max: 50,
  min: 50,
  idleTimeoutMillis: 1000 * (60 * 5), // close idle clients after 5 min
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
};

// console.log("Creating pool with the following settings", config);

// Create a connection pool. This generates new connections for every request.
const db = new Pool(config);

function getPool() {
  return new Pool(config);
}

async function executeQuery(sql, parameters) {
  const query = {
    text: sql,
    values: parameters,
  };

  const client = new Client();
  try {
    await client.connect();
    const res = await client.query(query);
    return res;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

async function getAll(sql, parameters) {
  try {
    const { rows } = await executeQuery(sql, parameters);
    return rows;
  } catch (error) {
    console.log(error.stack);
  }
}

async function getFirst(sql, parameters) {
  try {
    const { rows } = await executeQuery(sql, parameters);
    return rows[0];
  } catch (error) {
    console.log(error.stack);
  }
}

export default db;

async function save(sql, parameters) {
  if (typeof sql !== "string") {
    throw new Error("sql must be a string");
  }

  const query = {
    text: sql,
    values: parameters,
  };
  const client = new Client();

  try {
    await client.connect();
    await client.query(query);
    return;
  } catch (error) {
    console.log(error.stack, query);
  } finally {
    await client.end();
  }
}

class Database {
  constructor() {
    this.pool = new Pool();
  }

  async delete(sql, parameters) {
    const query = {
      text: sql,
      values: parameters,
    };

    try {
      await this.pool.query(query);
      return;
    } catch (error) {
      console.log(error.stack, query);
    }
  }

  async save(sql, parameters) {
    const query = {
      text: sql,
      values: parameters,
    };

    try {
      await this.pool.query(query);
      return;
    } catch (error) {
      console.log(error.stack, query);
    }
  }

  async getAll(sql, parameters) {
    try {
      const query = {
        text: sql,
        values: parameters,
      };
      const { rows } = await this.pool.query(query);
      return rows;
    } catch (error) {
      console.log(error.stack);
    }
  }

  async getFirst(sql, parameters) {
    const query = {
      text: sql,
      values: parameters,
    };
    try {
      const { rows } = await this.pool.query(query);
      return rows[0];
    } catch (error) {
      console.log(error.stack);
    }
  }

  async end() {
    try {
      await this.pool.end();
    } catch (error) {
      console.error(error);
    }
  }
}

export { getAll, save, getFirst, Database };
