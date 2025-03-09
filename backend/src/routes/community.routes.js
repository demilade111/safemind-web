const express = require("express");
const communityController = require("../controllers/community.controller");
const authMiddleware = require("../middleware/auth.middleware");
const { communityValidationRules } = require("../utils/validation");
const router = express.Router();
router.use(authMiddleware);
router.get("/", communityController.getCommunities);
router.post(
  "/",
  communityValidationRules.create,
  communityController.createCommunity
);
router.get("/:id", communityController.getCommunityById);
router.post("/:id/join", communityController.joinCommunity);
router.delete("/:id/leave", communityController.leaveCommunity);
router.get("/:id/posts", communityController.getCommunityPosts);
router.post(
  "/:id/posts",
  communityValidationRules.createPost,
  communityController.createCommunityPost
);
router.get("/:communityId/posts/:postId", communityController.getPostById);
router.post(
  "/:communityId/posts/:postId/comments",
  communityValidationRules.createComment,
  communityController.addComment
);
module.exports = router;
