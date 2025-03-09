const { check } = require("express-validator");
const userValidationRules = {
  register: [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    check("firstName", "First name is required").notEmpty(),
    check("lastName", "Last name is required").notEmpty(),
  ],
  login: [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  updateProfile: [
    check("firstName", "First name is required").optional().notEmpty(),
    check("lastName", "Last name is required").optional().notEmpty(),
    check("bio", "Bio cannot exceed 500 characters")
      .optional()
      .isLength({ max: 500 }),
    check("origin", "Origin country is required").optional().notEmpty(),
    check("currentCountry", "Current country is required")
      .optional()
      .notEmpty(),
  ],
};
const moodValidationRules = {
  create: [
    check("mood", "Mood is required").notEmpty(),
    check("intensity", "Intensity must be between 1 and 5").isInt({
      min: 1,
      max: 5,
    }),
    check("note", "Note cannot exceed 500 characters")
      .optional()
      .isLength({ max: 500 }),
  ],
};
const journalValidationRules = {
  create: [
    check("content", "Content is required").notEmpty(),
    check("title", "Title cannot exceed 100 characters")
      .optional()
      .isLength({ max: 100 }),
  ],
};
const communityValidationRules = {
  create: [
    check("name", "Name is required").notEmpty(),
    check("description", "Description is required").notEmpty(),
  ],
  createPost: [
    check("title", "Title is required").notEmpty(),
    check("content", "Content is required").notEmpty(),
  ],
  createComment: [check("content", "Content is required").notEmpty()],
};
module.exports = {
  userValidationRules,
  moodValidationRules,
  journalValidationRules,
  communityValidationRules,
};
