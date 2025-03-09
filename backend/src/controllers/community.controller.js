const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();
exports.getCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let filter = {
      isPublic: true,
    };
    if (search) {
      filter.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }
    const communities = await prisma.community.findMany({
      where: filter,
      skip,
      take: parseInt(limit),
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });
    const total = await prisma.community.count({
      where: filter,
    });
    res.status(200).json({
      communities,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error("Get communities error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.createCommunity = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, description, imageUrl, isPublic = true } = req.body;
    const userId = req.userId;
    const community = await prisma.community.create({
      data: {
        name,
        description,
        imageUrl,
        isPublic,
        members: {
          create: {
            userId,
            role: "admin",
          },
        },
      },
      include: {
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    res.status(201).json({
      message: "Community created successfully",
      community,
    });
  } catch (error) {
    console.error("Create community error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getCommunityById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
        members: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (!community.isPublic && community.members.length === 0) {
      return res.status(403).json({
        message:
          "This is a private community. You need to be a member to view it.",
      });
    }
    const userRole =
      community.members.length > 0 ? community.members[0].role : null;
    res.status(200).json({
      community: {
        ...community,
        userRole,
        members: undefined,
      },
    });
  } catch (error) {
    console.error("Get community error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const community = await prisma.community.findUnique({
      where: { id },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (!community.isPublic) {
      return res.status(403).json({
        message: "This is a private community. You need an invitation to join.",
      });
    }
    const existingMembership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId: id,
        },
      },
    });
    if (existingMembership) {
      return res
        .status(400)
        .json({ message: "You are already a member of this community" });
    }
    const membership = await prisma.communityMember.create({
      data: {
        userId,
        communityId: id,
        role: "member",
      },
    });
    res.status(200).json({
      message: "Successfully joined the community",
      membership,
    });
  } catch (error) {
    console.error("Join community error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId,
          communityId: id,
        },
      },
    });
    if (!membership) {
      return res
        .status(400)
        .json({ message: "You are not a member of this community" });
    }
    if (membership.role === "admin") {
      const adminCount = await prisma.communityMember.count({
        where: {
          communityId: id,
          role: "admin",
        },
      });
      if (adminCount === 1) {
        return res.status(400).json({
          message:
            "You cannot leave the community as you are the only admin. Please appoint another admin first.",
        });
      }
    }
    await prisma.communityMember.delete({
      where: {
        userId_communityId: {
          userId,
          communityId: id,
        },
      },
    });
    res.status(200).json({ message: "Successfully left the community" });
  } catch (error) {
    console.error("Leave community error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getCommunityPosts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const userId = req.userId;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (!community.isPublic && community.members.length === 0) {
      return res.status(403).json({
        message:
          "This is a private community. You need to be a member to view posts.",
      });
    }
    const posts = await prisma.communityPost.findMany({
      where: {
        communityId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parseInt(limit),
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    const total = await prisma.communityPost.count({
      where: {
        communityId: id,
      },
    });
    res.status(200).json({
      posts,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error("Get community posts error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.createCommunityPost = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.userId;
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (community.members.length === 0) {
      return res.status(403).json({
        message: "You need to be a member of this community to create posts.",
      });
    }
    const post = await prisma.communityPost.create({
      data: {
        communityId: id,
        authorId: userId,
        title,
        content,
      },
    });
    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create community post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getPostById = async (req, res) => {
  try {
    const { communityId, postId } = req.params;
    const userId = req.userId;
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          where: {
            userId,
          },
          select: {
            role: true,
          },
        },
      },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (!community.isPublic && community.members.length === 0) {
      return res.status(403).json({
        message:
          "This is a private community. You need to be a member to view posts.",
      });
    }
    const post = await prisma.communityPost.findFirst({
      where: {
        id: postId,
        communityId,
      },
      include: {
        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error("Get community post error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.addComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { communityId, postId } = req.params;
    const { content } = req.body;
    const authorId = req.userId;
    const community = await prisma.community.findUnique({
      where: { id: communityId },
      include: {
        members: {
          where: {
            userId: authorId,
          },
          select: {
            role: true,
          },
        },
      },
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (community.members.length === 0) {
      return res.status(403).json({
        message:
          "You need to be a member of this community to comment on posts.",
      });
    }
    const post = await prisma.communityPost.findFirst({
      where: {
        id: postId,
        communityId,
      },
    });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await prisma.comment.create({
      data: {
        postId,
        authorId,
        content,
      },
    });
    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
