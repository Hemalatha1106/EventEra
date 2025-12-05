import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    user: {                       // The user who created/hosts the event
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    ticketPrice: {                // New: price of the ticket
      type: Number,
      default: 0,
    },
    seatsAvailable: {             // New: how many seats left
      type: Number,
      required: true,
    },
    registrationDeadline: {       // New: last date to register
      type: Date,
      required: true,
    },
    status: {                     // New: is event open or closed
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
