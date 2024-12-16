const express = require("express");
const router = express.Router();
const {
  login,
  register,
  updateAdminToUser,
  updateUserToAdmin,
} = require("../../controller/admin/admin_authenticate");
const {
  loginValidator,
  registerAdminValidator,
} = require("../../validators/userValidator");

router.post("/login", loginValidator, login);

router.post("/register", registerAdminValidator, register);

router.post("/updater-user", updateUserToAdmin);

router.post("/updater-admin", updateAdminToUser);

// router.post("/logout", rrequireLogin, signout);

module.exports = router;
