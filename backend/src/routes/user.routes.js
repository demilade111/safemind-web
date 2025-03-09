const express = require("express");
const { check } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { userValidationRules } = require("../utils/validation");
const router = express.Router();
router.use(authMiddleware);
router.get("/profile", userController.getUserProfile);
router.put(
  "/profile",
  userValidationRules.updateProfile,
  userController.updateUserProfile
);
router.put(
  "/change-password",
  [
    check("currentPassword", "Current password is required").notEmpty(),
    check("newPassword", "New password must be at least 6 characters").isLength(
      { min: 6 }
    ),
  ],
  userController.changePassword
);
module.exports = router;
