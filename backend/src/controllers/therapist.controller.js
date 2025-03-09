const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
exports.getTherapists = async (req, res) => {
  try {
    const { specialties, languages, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    let filter = {
      isVerified: true,
    };
    if (specialties) {
      filter.specialties = {
        hasSome: Array.isArray(specialties) ? specialties : [specialties],
      };
    }
    if (languages) {
      filter.languages = {
        hasSome: Array.isArray(languages) ? languages : [languages],
      };
    }
    const therapists = await prisma.therapist.findMany({
      where: filter,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        specialties: true,
        languages: true,
        avatarUrl: true,
      },
      skip,
      take: parseInt(limit),
      orderBy: {
        lastName: "asc",
      },
    });
    const total = await prisma.therapist.count({
      where: filter,
    });
    res.status(200).json({
      therapists,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error("Get therapists error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getTherapistById = async (req, res) => {
  try {
    const { id } = req.params;
    const therapist = await prisma.therapist.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        bio: true,
        specialties: true,
        languages: true,
        avatarUrl: true,
        availabilities: true,
      },
    });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    res.status(200).json({ therapist });
  } catch (error) {
    console.error("Get therapist error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.bookSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { therapistId, startTime, endTime, type } = req.body;
    const userId = req.userId;
    const therapist = await prisma.therapist.findUnique({
      where: { id: therapistId },
    });
    if (!therapist) {
      return res.status(404).json({ message: "Therapist not found" });
    }
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);
    const dayOfWeek = startDateTime.getDay();
    const availability = await prisma.availability.findFirst({
      where: {
        therapistId,
        dayOfWeek,
        startTime: {
          lte: startDateTime,
        },
        endTime: {
          gte: endDateTime,
        },
      },
    });
    if (!availability) {
      return res.status(400).json({
        message: "Therapist is not available at the requested time",
      });
    }
    const existingSession = await prisma.therapistSession.findFirst({
      where: {
        therapistId,
        status: "scheduled",
        OR: [
          {
            startTime: {
              gte: startDateTime,
              lt: endDateTime,
            },
          },
          {
            endTime: {
              gt: startDateTime,
              lte: endDateTime,
            },
          },
          {
            startTime: {
              lte: startDateTime,
            },
            endTime: {
              gte: endDateTime,
            },
          },
        ],
      },
    });
    if (existingSession) {
      return res.status(400).json({
        message: "Therapist is already booked during this time",
      });
    }
    const session = await prisma.therapistSession.create({
      data: {
        userId,
        therapistId,
        startTime: startDateTime,
        endTime: endDateTime,
        status: "scheduled",
        type,
      },
    });
    res.status(201).json({
      message: "Session booked successfully",
      session,
    });
  } catch (error) {
    console.error("Book session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUserSessions = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.query;
    let filter = {
      userId,
    };
    if (status) {
      filter.status = status;
    }
    const sessions = await prisma.therapistSession.findMany({
      where: filter,
      include: {
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        startTime: "asc",
      },
    });
    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Get user sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        therapist: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            bio: true,
            specialties: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    res.status(200).json({ session });
  } catch (error) {
    console.error("Get session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.cancelSession = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const now = new Date();
    if (session.startTime < now) {
      return res.status(400).json({
        message: "Cannot cancel a session that has already started or ended",
      });
    }
    const updatedSession = await prisma.therapistSession.update({
      where: { id },
      data: {
        status: "cancelled",
      },
    });
    res.status(200).json({
      message: "Session cancelled successfully",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Cancel session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.sendMessage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { content } = req.body;
    const senderId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        OR: [{ userId: senderId }, { therapist: { id: senderId } }],
      },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const message = await prisma.message.create({
      data: {
        content,
        senderId,
        sessionId: id,
      },
    });
    res.status(201).json({
      message: "Message sent successfully",
      chatMessage: message,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getSessionMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const session = await prisma.therapistSession.findFirst({
      where: {
        id,
        OR: [{ userId }, { therapist: { id: userId } }],
      },
    });
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }
    const messages = await prisma.message.findMany({
      where: {
        sessionId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json({ messages });
  } catch (error) {
    console.error("Get session messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
