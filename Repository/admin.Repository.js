const { pool } = require("../Config/Databse.config");

exports.find_user = async (data) => {
  const conn = await pool.getConnection();
  const sql = `SELECT * FROM admin WHERE ${data.field} = ?`;
  const result = await conn.query(sql, [
    data.value,
  ]);
  return result;
};

exports.update = async (data, id) => {
  const conn = await pool.getConnection();
  const sql = `UPDATE admin SET ${data.field} = ? WHERE id = ?`;
  const result = await conn.query(sql, [ data.value, id ]);
  conn.release();
  return result;
}



