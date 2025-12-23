import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createEvent,
  getAllEvents,
  getMyEvents,
  updateEvent,
  deleteEvent,
  getEventById,
  registerForEvent,
  unregisterFromEvent,
  getRegisteredEvents,
  getEventParticipants
} from "../controllers/eventController.js";

const router = express.Router();

// 🌐 Public routes
router.get("/all", getAllEvents);                 // Get all events

// 🔐 Protected routes (specific routes first)
router.get("/registered", protect, getRegisteredEvents);  // Get events user registered for
router.get("/:id/participants", protect, getEventParticipants); // Get event participants

// General routes
router.get("/:id", getEventById);                // Get single event (public)
router.post("/", protect, createEvent);                   // Create event
router.get("/", protect, getMyEvents);                    // Get my events
router.put("/:id", protect, updateEvent);                // Update event
router.delete("/:id", protect, deleteEvent);             // Delete event
router.post("/:id/register", protect, registerForEvent);  // User registers for event
router.delete("/:id/unregister", protect, unregisterFromEvent); // User unregisters from event

export default router;
