const Admin = require("../Models/admin.Model");
const bcrypt = require("bcrypt");

exports.create_Admin_logic = async (name, phone, password) => {
  const hash = await bcrypt.hash(password, 10);
  if (hash) {
    console.log("test-2-passed");
  } else {
    console.log("test-2-failed");
    return {
      success: false,
      message: "could not hash the password",
    };
  }

  const createResult = await Admin.create(name, phone, hash);
  if (createResult.success) {
    console.log("test-2-passed");
    return {
      success: true,
      data: createResult,
    };
  } else {
    console.log("test-2-failed");
    return {
      success: false,
      message: createResult.message || "failed to create the admin",
    };
  }
};

exports.log_in_logic = async (phone, password) => {
  const createResult = await Admin.login(phone, password);
  if (createResult.success) {
    console.log("test-2-passed");
  } else {
    console.log("test-2-failed");
    return {
      success: false,
      message: createResult.message || "failed to create the admin",
    };
  }

  const accessToken = await Admin.GenerateToken(createResult.data.user[ 0 ]);
  if (accessToken) {
    console.log("test-3-passed");
    return {
      success: true,
      data: createResult,
      accessToken: accessToken,
    };
  } else {
    return {
      success: false,
      message: accessToken.message || "failed to generate the token",
    };
  }
};

exports.update_logic = async (phone, password, name, id) => {
  const find_user = await Admin.update(phone, password, name, id);
  if (find_user.success) {
    return {
      success: true,
      data: "Data updated",
    };
  } else {
    return {
      success: false,
      message: find_user.message,
    };
  }
};
