const express = require("express");
const { check } = require("express-validator");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
router.post(
  "/register",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("firstName", "First name is required").notEmpty(),
    check("lastName", "Last name is required").notEmpty(),
  ],
  authController.register
);
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  authController.login
);
router.get("/me", authMiddleware, authController.getCurrentUser);
module.exports = router;
