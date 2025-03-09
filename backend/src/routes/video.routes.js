const express = require("express");
const { check } = require("express-validator");
const videoController = require("../controllers/video.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
router.use(authMiddleware);
router.post(
  "/sessions",
  [
    check("therapistId", "Therapist ID is required").notEmpty(),
    check("scheduledTime", "Scheduled time is required").notEmpty().isISO8601(),
    check("duration", "Duration must be a number").isNumeric(),
    check("type", "Type is required").optional().isIn(["video", "chat"]),
  ],
  videoController.createVideoSession
);
router.get("/sessions/user", videoController.getUserVideoSessions);
router.get("/sessions/therapist", videoController.getTherapistVideoSessions);
router.get("/sessions/:id", videoController.getVideoSessionDetails);
router.put(
  "/sessions/:id/status",
  [
    check("status", "Status is required")
      .notEmpty()
      .isIn(["scheduled", "active", "completed", "cancelled"]),
  ],
  videoController.updateVideoSessionStatus
);
router.post(
  "/broadcast",
  [
    check("title", "Title is required").notEmpty(),
    check("description", "Description is required").optional(),
    check("scheduledTime", "Scheduled time must be a valid date")
      .optional()
      .isISO8601(),
  ],
  videoController.startLiveBroadcast
);
router.get("/broadcast/active", videoController.getActiveBroadcasts);
router.get("/sessions/:id/messages", videoController.getSessionMessages);
router.post(
  "/sessions/statistics",
  [
    check("sessionId", "Session ID is required").notEmpty(),
    check("duration", "Duration must be a number").isNumeric(),
    check("quality", "Quality is required").notEmpty(),
  ],
  videoController.recordCallStatistics
);
module.exports = router;
