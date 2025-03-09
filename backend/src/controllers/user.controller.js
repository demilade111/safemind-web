const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        profile: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    const {
      firstName,
      lastName,
      bio,
      origin,
      currentCountry,
      interests,
      languages,
      avatarUrl,
    } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName !== undefined ? firstName : undefined,
        lastName: lastName !== undefined ? lastName : undefined,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        bio: bio !== undefined ? bio : undefined,
        origin: origin !== undefined ? origin : undefined,
        currentCountry:
          currentCountry !== undefined ? currentCountry : undefined,
        interests: interests !== undefined ? interests : undefined,
        languages: languages !== undefined ? languages : undefined,
        avatarUrl: avatarUrl !== undefined ? avatarUrl : undefined,
      },
      create: {
        userId,
        bio,
        origin,
        currentCountry,
        interests: interests || [],
        languages: languages || [],
        avatarUrl,
      },
    });
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        ...updatedUser,
        profile,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
