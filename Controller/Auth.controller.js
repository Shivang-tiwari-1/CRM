const { options } = require("joi");
const Admin = require("../Models/admin.Model");
const {
  create_Admin_logic,
  log_in_logic,
} = require("../Services/Auth.Service");
const { cookie_options } = require("../Constant");

exports.create_admin = async (req, res) => {
  try {
    const { phone, name, password } = req.body;
    if (phone && name && password) {
      console.log("test-1-passed");
    } else {
      console.log("test-1-failed");
      return res.status(400).json({
        success: false,
        message: "data missing",
      });
    }

    const createResult = await create_Admin_logic(name, phone, password);
    if (createResult.success) {
      return res.status(200).json({
        success: true,
        user: {
          ...createResult?.data?.user,
          id: Number(createResult?.data?.user.id),
        },
      });
    } else {
      return res.status(400).json({
        success: createResult?.success,
        message: createResult?.message,
      });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  if (phone && password) {
    console.log("test-1-passed");
  } else {
    console.log("test-1-failed");
    return res.status(400).json({
      success: false,
      message: "data missing",
    });
  }

  const createResult = await log_in_logic(phone, password);
  console.log(createResult);
  if (createResult.success) {
    console.log(createResult.data.data.user[0]);
    return res
      .status(200)
      .cookie("accessToken", createResult?.accessToken, cookie_options)
      .json({
        success: true,
        user: {
          ...createResult?.data?.data?.user[0],
          id: Number(createResult?.data?.data?.user[0].id),
        },
      });
  } else {
    return res.status(400).json({
      success: createResult?.success,
      message: createResult?.message,
    });
  }
};

exports.update = async (req, res) => {
  const { phone, password, name } = req.body;
  if ([phone, password, name].some((data) => data !== undefined)) {
    console.log("test-1=>passed");
  } else {
    console.log("test-1-failed");
    return res.status(400).json({
      success: false,
      message: "data missing",
    });
  }
  
};
