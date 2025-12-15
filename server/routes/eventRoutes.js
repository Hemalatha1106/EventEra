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
  getRegisteredEvents
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", protect, createEvent);           // Create
router.get("/all", getAllEvents);                 // Get all events
router.get("/", protect, getMyEvents);            // Get all my events
router.get("/:id", getEventById);                 // Get single (public)
router.put("/:id", protect, updateEvent);         // Update
router.delete("/:id", protect, deleteEvent);      // Delete
router.post("/:id/register", protect, registerForEvent);
router.get("/registered", protect, getRegisteredEvents);

export default router;
