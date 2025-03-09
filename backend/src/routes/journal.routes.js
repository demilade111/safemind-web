const express = require("express");
const journalController = require("../controllers/journal.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { journalValidationRules } = require("../utils/validation");
const router = express.Router();
router.use(authMiddleware);
router.post(
  "/",
  journalValidationRules.create,
  journalController.createJournalEntry
);
router.get("/", journalController.getJournalEntries);
router.get("/:id", journalController.getJournalEntryById);
router.put(
  "/:id",
  journalValidationRules.create,
  journalController.updateJournalEntry
);
router.delete("/:id", journalController.deleteJournalEntry);
module.exports = router;
