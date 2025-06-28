const { pool } = require("../Config/Databse.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { find_user, update } = require("../Repository/admin.Repository");

class Admin {
  static async create(name, phone, password) {
    try {
      const conn = await pool.getConnection();

      await conn.beginTransaction();

      const result = await conn.query(
        "INSERT INTO admin (name, phone,password) VALUES (?, ?,?)",
        [ name, phone, password ]
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

    const result = await find_user({ field: "phone", value: phone });

    const compare_pass = await bcrypt.compare(password, result[ 0 ].password);
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


  static async update(phone, password, name, id) {
    const result = await find_user({ field: "id", value: id });
    if (!result) {
      return {
        success: false,
        message: "Could not fetch the admin details"
      };
    }
    console.log("--_>",result)

    const updates = [];
    if (phone) updates.push({ field: "phone", value: phone });
    if (password) updates.push({ field: "password", value: password });
    if (name) updates.push({ field: "name", value: name });
    
    for (const updateData of updates) {
      const updated = await update(updateData, result[ 0 ].id);
      if (!updated) {
        return {
          success: false,
          message: `Could not update ${updateData.field}`
        };
      }
    }

    return {
      success: true,
      message: "Update successful"
    };
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
