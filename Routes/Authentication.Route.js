const {
  create_admin,
  login,
  update,
} = require("../Controller/Auth.controller");
const { authentication } = require("../Middleware/Auth.Middleware");

const router = require("express").Router();

router.post("/create_admin", create_admin);
router.get("/login_admin", login);
router.get("/update", authentication, update);

module.exports = router;
