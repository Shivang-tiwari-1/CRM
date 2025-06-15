const { pool } = require("../Config/Databse.config");

exports.find_user = async (data) => {
  const conn = await pool.getConnection();

  const result = await conn.query(`SELECT * FROM admin WHERE ${data} = ?`, [
    data,
  ]);

  return result;
};
