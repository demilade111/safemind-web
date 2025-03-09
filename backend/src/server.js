const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { PrismaClient } = require("@prisma/client");
const { initializeSocketServer } = require("./services/socket.service");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const moodRoutes = require("./routes/mood.routes");
const journalRoutes = require("./routes/journal.routes");
const therapistRoutes = require("./routes/therapist.routes");
const communityRoutes = require("./routes/community.routes");
const articleRoutes = require("./routes/article.routes");
const eventRoutes = require("./routes/event.routes");
const videoRoutes = require("./routes/video.routes");
dotenv.config();
const prisma = new PrismaClient();
const app = express();
const PORT =  8000;
const server = http.createServer(app);
const io = initializeSocketServer(server);
app.use(cors());
app.use(express.json());
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/therapists", therapistRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/video", videoRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: err.message || "An unexpected error occurred",
  });
});
const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket server initialized`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
startServer();
