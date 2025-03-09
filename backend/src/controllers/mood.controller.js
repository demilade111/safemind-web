const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();
exports.createMoodEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { mood, intensity, note } = req.body;
    const userId = req.userId;
    const moodEntry = await prisma.moodEntry.create({
      data: {
        userId,
        mood,
        intensity,
        note,
      },
    });
    res.status(201).json({
      message: "Mood entry created successfully",
      moodEntry,
    });
  } catch (error) {
    console.error("Create mood entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMoodEntries = async (req, res) => {
  try {
    const userId = req.userId;
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    } else if (startDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
        },
      };
    } else if (endDate) {
      dateFilter = {
        date: {
          lte: new Date(endDate),
        },
      };
    }
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId,
        ...dateFilter,
      },
      orderBy: {
        date: "desc",
      },
    });
    res.status(200).json({ moodEntries });
  } catch (error) {
    console.error("Get mood entries error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMoodEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const moodEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!moodEntry) {
      return res.status(404).json({ message: "Mood entry not found" });
    }
    res.status(200).json({ moodEntry });
  } catch (error) {
    console.error("Get mood entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateMoodEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { mood, intensity, note } = req.body;
    const userId = req.userId;
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!existingEntry) {
      return res.status(404).json({ message: "Mood entry not found" });
    }
    const updatedEntry = await prisma.moodEntry.update({
      where: { id },
      data: {
        mood,
        intensity,
        note,
      },
    });
    res.status(200).json({
      message: "Mood entry updated successfully",
      moodEntry: updatedEntry,
    });
  } catch (error) {
    console.error("Update mood entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteMoodEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existingEntry = await prisma.moodEntry.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!existingEntry) {
      return res.status(404).json({ message: "Mood entry not found" });
    }
    await prisma.moodEntry.delete({
      where: { id },
    });
    res.status(200).json({ message: "Mood entry deleted successfully" });
  } catch (error) {
    console.error("Delete mood entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getMoodAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { period } = req.query;
    let startDate;
    const endDate = new Date();
    switch (period) {
      case "week":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate = new Date();
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
    }
    const moodEntries = await prisma.moodEntry.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });
    const moodCounts = {};
    let totalIntensity = 0;
    moodEntries.forEach((entry) => {
      moodCounts[entry.mood] = moodCounts[entry.mood]
        ? moodCounts[entry.mood] + 1
        : 1;
      totalIntensity += entry.intensity;
    });
    const averageIntensity =
      moodEntries.length > 0 ? totalIntensity / moodEntries.length : 0;
    const analytics = {
      totalEntries: moodEntries.length,
      moodCounts,
      averageIntensity,
      period,
      startDate,
      endDate,
    };
    res.status(200).json({ analytics });
  } catch (error) {
    console.error("Get mood analytics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
