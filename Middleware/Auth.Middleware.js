const { find_user } = require("../Repository/admin.Repository");
const jwt = require("jsonwebtoken");

exports.authentication = async (req, res, next) => {
  console.log("|authentication starts|");
  const authHeader = req.headers.authorization || req.headers.Authorization;
  let tokenFromHeader = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies.accessToken;
  if (tokenFromHeader !== null) {
    console.log("test1-token-passed");
  } else {
    console.log("test1-token-failed");
    return res.status(400).json({
      message: "no token found",
    });
  }

  const decode = jwt.verify(
    tokenFromHeader,
    process.env.JWT_SECRET
  );
  if (decode) {
    console.log("test2-token-passed");
  } else {
    console.log("test2-token-failed");
    return res.status(500).json({
      message: "invalid token user id",
    });
  }

  const data = await find_user(decode.id);
  if (data) {
    console.log("test3-token-passed");
  } else {
    console.log("test3-token-failed");
    return res.status(500).json({
      message: "invalid token user id",
    });
  }
  req.admin = data;

  console.log("|authentication end|");
  next();
};
