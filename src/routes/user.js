const express = require("express");
const router = express.Router();
const { login, register, signout } = require("../controller/authenticate");
const { requireLogin } = require("../middleware");
const {
  loginValidator,
  isRequestValidated,
  registerValidator,
} = require("../validators/userValidator");
const { updateUser, fetchUsers, deleteUser } = require("../controller/user");

router.post("/login", loginValidator, isRequestValidated, login);

router.post("/register", registerValidator, register);

router.post("/update-user", isRequestValidated, updateUser);

router.get("/fetch-user", isRequestValidated, fetchUsers);
router.delete("/delete-user/:id", deleteUser);

router.post("/logout", signout);

// router.post("/profile", requireLogin, (req, res) => {
//   res.status(200).json({
//     user: "profile",
//   });
// });

module.exports = router;
