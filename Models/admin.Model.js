const { pool } = require("../Config/Databse.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { find_user } = require("../Repository/admin.Repository");

class Admin {
  static async create(name, phone, password) {
    try {
      const conn = await pool.getConnection();

      await conn.beginTransaction();

      const result = await conn.query(
        "INSERT INTO admin (name, phone,password) VALUES (?, ?,?)",
        [name, phone, password]
      );

      const insertId = result.insertId;

      const newUser = {
        id: insertId,
        name,
        phone,
        password,
      };

      await conn.commit();
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }

  static async login(phone, password) {
    const conn = await pool.getConnection();

    await conn.beginTransaction();

    const result = await find_user(phone);
    console.log(result);
    const compare_pass = await bcrypt.compare(password, result[0].password);
    if (compare_pass) {
      return {
        success: true,
        data: {
          user: result,
        },
      };
    } else {
      return {
        success: false,
        message: "wrong cred",
      };
    }
  }

  static async GenerateToken(userData) {
    try {
      const payload = {
        id: Number(userData.id),
      };

      const accessToken = jwt.sign(payload, process.env.JWT_SECRET);
      return accessToken;
    } catch (error) {
      return {
        success: false,
        message: error,
      };
    }
  }
}

module.exports = Admin;
