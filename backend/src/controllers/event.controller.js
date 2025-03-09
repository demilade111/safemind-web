const { PrismaClient } = require("@prisma/client");
const { validationResult } = require("express-validator");
const prisma = new PrismaClient();
const eventsRepository = [
  {
    id: "1",
    title: "Mindfulness Workshop",
    description: "Learn mindfulness techniques to reduce stress and anxiety.",
    startTime: new Date("2023-12-15T14:00:00Z"),
    endTime: new Date("2023-12-15T16:00:00Z"),
    location: "Online",
    type: "workshop",
    imageUrl: "https://example.com/images/mindfulness.jpg",
    attendees: [],
  },
  {
    id: "2",
    title: "Cultural Adjustment Q&A Session",
    description:
      "Interactive session to discuss challenges and tips for cultural adjustment.",
    startTime: new Date("2023-12-18T18:00:00Z"),
    endTime: new Date("2023-12-18T19:30:00Z"),
    location: "Online",
    type: "qa-session",
    imageUrl: "https://example.com/images/cultural-adjustment.jpg",
    attendees: [],
  },
  {
    id: "3",
    title: "Stress Management for Students",
    description:
      "Strategies to manage academic stress for international students.",
    startTime: new Date("2023-12-20T15:00:00Z"),
    endTime: new Date("2023-12-20T16:30:00Z"),
    location: "Online",
    type: "workshop",
    imageUrl: "https://example.com/images/stress-management.jpg",
    attendees: [],
  },
];
exports.getEvents = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    let filteredEvents = [...eventsRepository];
    if (startDate) {
      const start = new Date(startDate);
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.startTime) >= start
      );
    }
    if (endDate) {
      const end = new Date(endDate);
      filteredEvents = filteredEvents.filter(
        (event) => new Date(event.startTime) <= end
      );
    }
    if (type) {
      filteredEvents = filteredEvents.filter((event) => event.type === type);
    }
    const userId = req.userId;
    const eventsWithAttendance = filteredEvents.map((event) => ({
      ...event,
      isAttending: event.attendees.includes(userId),
      attendeeCount: event.attendees.length,
      attendees: undefined, 
    }));
    res.status(200).json({ events: eventsWithAttendance });
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const event = eventsRepository.find((event) => event.id === id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    const eventWithAttendance = {
      ...event,
      isAttending: event.attendees.includes(userId),
      attendeeCount: event.attendees.length,
      attendees: undefined, 
    };
    res.status(200).json({ event: eventWithAttendance });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.rsvpToEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const eventIndex = eventsRepository.findIndex((event) => event.id === id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: "Event not found" });
    }
    if (eventsRepository[eventIndex].attendees.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already attending this event" });
    }
    eventsRepository[eventIndex].attendees.push(userId);
    res.status(200).json({
      message: "Successfully RSVP'd to the event",
      isAttending: true,
      attendeeCount: eventsRepository[eventIndex].attendees.length,
    });
  } catch (error) {
    console.error("RSVP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.cancelRsvp = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const eventIndex = eventsRepository.findIndex((event) => event.id === id);
    if (eventIndex === -1) {
      return res.status(404).json({ message: "Event not found" });
    }
    const attendeeIndex =
      eventsRepository[eventIndex].attendees.indexOf(userId);
    if (attendeeIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not attending this event" });
    }
    eventsRepository[eventIndex].attendees.splice(attendeeIndex, 1);
    res.status(200).json({
      message: "Successfully cancelled RSVP",
      isAttending: false,
      attendeeCount: eventsRepository[eventIndex].attendees.length,
    });
  } catch (error) {
    console.error("Cancel RSVP error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getUpcomingEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const now = new Date();
    const upcomingEvents = eventsRepository
      .filter((event) => {
        return (
          new Date(event.startTime) > now && event.attendees.includes(userId)
        );
      })
      .map((event) => ({
        ...event,
        isAttending: true,
        attendeeCount: event.attendees.length,
        attendees: undefined, 
      }));
    res.status(200).json({ events: upcomingEvents });
  } catch (error) {
    console.error("Get upcoming events error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
