const express = require("express");
const { check } = require("express-validator");
const therapistController = require("../controllers/therapist.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
router.get("/", authMiddleware, therapistController.getTherapists);
router.get("/:id", authMiddleware, therapistController.getTherapistById);
router.post(
  "/book",
  [
    authMiddleware,
    check("therapistId", "Therapist ID is required").notEmpty(),
    check("startTime", "Start time is required").notEmpty().isISO8601(),
    check("endTime", "End time is required").notEmpty().isISO8601(),
    check("type", "Session type is required")
      .notEmpty()
      .isIn(["video", "chat"]),
  ],
  therapistController.bookSession
);
router.get("/sessions", authMiddleware, therapistController.getUserSessions);
router.get("/sessions/:id", authMiddleware, therapistController.getSessionById);
router.put(
  "/sessions/:id/cancel",
  authMiddleware,
  therapistController.cancelSession
);
router.post(
  "/sessions/:id/messages",
  [authMiddleware, check("content", "Message content is required").notEmpty()],
  therapistController.sendMessage
);
router.get(
  "/sessions/:id/messages",
  authMiddleware,
  therapistController.getSessionMessages
);
module.exports = router;
