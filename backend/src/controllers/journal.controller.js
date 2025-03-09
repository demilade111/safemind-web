const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();
exports.createJournalEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { content, title } = req.body;
    const userId = req.userId;
    const journalEntry = await prisma.journalEntry.create({
      data: {
        userId,
        content,
        title,
      },
    });
    res.status(201).json({
      message: "Journal entry created successfully",
      journalEntry,
    });
  } catch (error) {
    console.error("Create journal entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getJournalEntries = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const journalEntries = await prisma.journalEntry.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: parseInt(limit),
    });
    const total = await prisma.journalEntry.count({
      where: {
        userId,
      },
    });
    res.status(200).json({
      journalEntries,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      totalItems: total,
    });
  } catch (error) {
    console.error("Get journal entries error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getJournalEntryById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const journalEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!journalEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    res.status(200).json({ journalEntry });
  } catch (error) {
    console.error("Get journal entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateJournalEntry = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { content, title } = req.body;
    const userId = req.userId;
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!existingEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        content,
        title,
      },
    });
    res.status(200).json({
      message: "Journal entry updated successfully",
      journalEntry: updatedEntry,
    });
  } catch (error) {
    console.error("Update journal entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.deleteJournalEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const existingEntry = await prisma.journalEntry.findFirst({
      where: {
        id,
        userId,
      },
    });
    if (!existingEntry) {
      return res.status(404).json({ message: "Journal entry not found" });
    }
    await prisma.journalEntry.delete({
      where: { id },
    });
    res.status(200).json({ message: "Journal entry deleted successfully" });
  } catch (error) {
    console.error("Delete journal entry error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
