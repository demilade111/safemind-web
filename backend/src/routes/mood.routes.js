const express = require("express");
const moodController = require("../controllers/mood.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { moodValidationRules } = require("../utils/validation");
const router = express.Router();
router.use(authMiddleware);
router.post("/", moodValidationRules.create, moodController.createMoodEntry);
router.get("/", moodController.getMoodEntries);
router.get("/:id", moodController.getMoodEntryById);
router.put("/:id", moodValidationRules.create, moodController.updateMoodEntry);
router.delete("/:id", moodController.deleteMoodEntry);
router.get("/analytics", moodController.getMoodAnalytics);
module.exports = router;
