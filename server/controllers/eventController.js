import Event from "../models/event.js";
import User from "../models/user.js";  // ✅ Must match the file name exactly

// CREATE EVENT
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, ticketPrice, seatsAvailable, registrationDeadline, status } = req.body;

    const event = await Event.create({
      user: req.user._id,
      title,
      description,
      date,
      location,
      ticketPrice: ticketPrice || 0,
      seatsAvailable,
      registrationDeadline,
      status: status || "open",
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EVENTS
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('user', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MY EVENTS
export const getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({ user: req.user._id });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EVENT
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('user', 'name');
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EVENT
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not allowed" });
    }

    // Update all fields
    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.date = req.body.date || event.date;
    event.location = req.body.location || event.location;
    event.ticketPrice = req.body.ticketPrice || event.ticketPrice;
    event.seatsAvailable = req.body.seatsAvailable || event.seatsAvailable;
    event.registrationDeadline = req.body.registrationDeadline || event.registrationDeadline;
    event.status = req.body.status || event.status;

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EVENT
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not allowed" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// USER registers for event
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const now = new Date();

    // Check deadline
    if (event.registrationDeadline < now) {
      event.status = "closed";
      await event.save();
      return res.status(400).json({ message: "Registration closed (deadline passed)" });
    }

    // Check seat availability
    if (event.seatsAvailable <= 0) {
      event.status = "closed";
      await event.save();
      return res.status(400).json({ message: "Event full, registration closed" });
    }

    // Reduce seat count by 1
    event.seatsAvailable -= 1;

    // If seats now 0, close event
    if (event.seatsAvailable === 0) event.status = "closed";

    await event.save();

    // ADD event to user's registeredEvents
    const user = await User.findById(req.user._id);
    const eventIdStr = event._id.toString();
    const hasRegistered = user.registeredEvents.some(id => id.toString() === eventIdStr);
    if (!hasRegistered) {
      user.registeredEvents.push(event._id);
      await user.save();
    }

    res.json({ message: "Registered successfully", seatsLeft: event.seatsAvailable, status: event.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    // Filter out invalid ObjectIds and populate only valid ones
    const validEventIds = user.registeredEvents.filter(id => {
      try {
        const idStr = id.toString();
        return id && idStr.match(/^[0-9a-fA-F]{24}$/);
      } catch {
        return false;
      }
    });

    const populatedEvents = await Event.find({ _id: { $in: validEventIds } });
    res.json(populatedEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
