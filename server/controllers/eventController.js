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
    const event = await Event.findById(req.params.id)
    const user = await User.findById(req.user._id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // ❌ Registration closed
    if (event.status === "closed") {
      return res.status(400).json({ message: "Registration closed" })
    }

    // ❌ Deadline passed
    if (new Date() > event.registrationDeadline) {
      return res.status(400).json({ message: "Registration deadline passed" })
    }

    // ❌ Seats full
    if (event.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" })
    }

    // ❌ Already registered
    const alreadyRegistered = event.registrations.some(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyRegistered) {
      return res.status(400).json({ message: "Already registered" })
    }

    // ✅ Add registration
    event.registrations.push({
      user: req.user._id,
      paymentStatus: event.ticketPrice === 0 ? "free" : "pending",
    })

    event.seatsAvailable -= 1

    await event.save()

    // Optional: also track in user
    user.registeredEvents.push(event._id)
    await user.save()

    res.status(200).json({ message: "Registered successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Registration failed" })
  }
}

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

// GET PARTICIPANTS OF AN EVENT (HOST ONLY)
export const getEventParticipants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("registrations.user", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔐 Only host can see participants
    if (event.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(event.registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

