import oracledb from "oracledb";
import dotenv from 'dotenv'
dotenv.config();

export const connection = async () => {
  try {
    const conn = await oracledb.getConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
      connectString: process.env.CONNECT_STRING,
      privilege: oracledb.SYSDBA, 
    });

    console.log("Connected to Oracle database");
    return conn;
  } catch (err) {
    console.log(err);
    throw err; 
  }
};

export const run_query = async (query, params) => {
  let conn;
  try {
    conn = await connection();
    const result = await conn.execute(query, params);
    await conn.commit();
    return result.rows;
  } catch (err) {
    console.log(err);
    throw err; // Rethrow the error to propagate it
  } finally {
    if (conn) {
      try {
        await conn.close();
      } catch (err) {
        console.log("Error closing connection:", err);
      }
    }
  }
};