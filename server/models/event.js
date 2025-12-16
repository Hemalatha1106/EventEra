import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    // 👑 Host of the event
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📌 Basic details
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },

    // 🗓️ Event date & time
    date: {
      type: Date,
      required: true,
    },

    // 💰 Pricing
    ticketPrice: {
      type: Number,
      default: 0, // 0 = free event
    },

    // 🎟️ Capacity
    seatsAvailable: {
      type: Number,
      required: true,
    },

    // ⏰ Registration cutoff
    registrationDeadline: {
      type: Date,
      required: true,
    },

    // 🚦 Event status
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    // 👥 REGISTERED PARTICIPANTS (🔥 IMPORTANT)
    registrations: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },

        // 💳 Payment support (future Razorpay)
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "free"],
          default: "free",
        },

        paymentId: String, // Razorpay payment_id (future)

        // 🎫 QR ticket (future)
        ticketId: String, // unique ticket ID
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
