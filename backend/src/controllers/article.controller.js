const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();
exports.getArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, tags, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let filter = {};
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = {
        hasSome: tagArray,
      };
    }
    if (search) {
      filter.OR = [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }
    const articles = await prisma.article.findMany({
      where: filter,
      select: {
        id: true,
        title: true,
        summary: true,
        imageUrl: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.article.count({
      where: filter,
    });
    res.status(200).json({
      articles,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error("Get articles error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        bookmarks: {
          where: {
            userId,
          },
          select: {
            id: true,
          },
        },
      },
    });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    const isBookmarked = article.bookmarks.length > 0;
    res.status(200).json({
      article: {
        ...article,
        isBookmarked,
        bookmarks: undefined, 
      },
    });
  } catch (error) {
    console.error("Get article error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.bookmarkArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const article = await prisma.article.findUnique({
      where: { id },
    });
    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }
    const existingBookmark = await prisma.articleBookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });
    if (existingBookmark) {
      return res.status(400).json({ message: "Article already bookmarked" });
    }
    const bookmark = await prisma.articleBookmark.create({
      data: {
        userId,
        articleId: id,
      },
    });
    res.status(200).json({
      message: "Article bookmarked successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Bookmark article error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const bookmark = await prisma.articleBookmark.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    await prisma.articleBookmark.delete({
      where: {
        userId_articleId: {
          userId,
          articleId: id,
        },
      },
    });
    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Remove bookmark error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getBookmarkedArticles = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const bookmarks = await prisma.articleBookmark.findMany({
      where: {
        userId,
      },
      include: {
        article: {
          select: {
            id: true,
            title: true,
            summary: true,
            imageUrl: true,
            tags: true,
            createdAt: true,
          },
        },
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
    });
    const total = await prisma.articleBookmark.count({
      where: {
        userId,
      },
    });
    const articles = bookmarks.map((bookmark) => ({
      ...bookmark.article,
      bookmarkedAt: bookmark.createdAt,
    }));
    res.status(200).json({
      articles,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error("Get bookmarked articles error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getRecommendedArticles = async (req, res) => {
  try {
    const userId = req.userId;
    const { limit = 5 } = req.query;
    const userProfile = await prisma.profile.findUnique({
      where: {
        userId,
      },
      select: {
        interests: true,
      },
    });
    if (
      !userProfile ||
      !userProfile.interests ||
      userProfile.interests.length === 0
    ) {
      const recentArticles = await prisma.article.findMany({
        take: parseInt(limit),
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          summary: true,
          imageUrl: true,
          tags: true,
          createdAt: true,
        },
      });
      return res.status(200).json({
        articles: recentArticles,
        message: "No interests found. Showing recent articles.",
      });
    }
    const recommendedArticles = await prisma.article.findMany({
      where: {
        tags: {
          hasSome: userProfile.interests,
        },
      },
      take: parseInt(limit),
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        summary: true,
        imageUrl: true,
        tags: true,
        createdAt: true,
      },
    });
    res.status(200).json({
      articles: recommendedArticles,
    });
  } catch (error) {
    console.error("Get recommended articles error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
