const express = require("express");
const articleController = require("../controllers/article.controller");
const authMiddleware = require("../middleware/auth.middleware");
const router = express.Router();
router.use(authMiddleware);
router.get("/", articleController.getArticles);
router.get("/recommended", articleController.getRecommendedArticles);
router.get("/bookmarked", articleController.getBookmarkedArticles);
router.get("/:id", articleController.getArticleById);
router.post("/:id/bookmark", articleController.bookmarkArticle);
router.delete("/:id/bookmark", articleController.removeBookmark);
module.exports = router;
