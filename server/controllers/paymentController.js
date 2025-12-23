import Razorpay from "razorpay";
import crypto from "crypto";
import Event from "../models/event.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project folder (EventEra/.env) if present, otherwise fallback to default
const projectEnvPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: projectEnvPath });

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
export const createRazorpayOrder = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 1. Check if user is already registered
    const alreadyRegistered = event.registrations.some(
      (reg) => reg.user.toString() === req.user.id
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered for this event" });
    }

    // 2. Check for seat availability
    if (event.seatsAvailable <= 0) {
      return res.status(400).json({ message: "Event is fully booked" });
    }

    if (event.ticketPrice <= 0) {
      return res.status(400).json({ message: "Free event. Use /register-free endpoint." });
    }

    // FIX: Shorten the receipt ID to be under 40 chars
    // specific to user (last 4 chars) and unique by time
    const shortReceipt = `rcpt_${req.user.id.slice(-4)}_${Date.now()}`;

    const options = {
      amount: Math.round(event.ticketPrice * 100), 
      currency: "INR",
      receipt: shortReceipt, // Now ~22 characters
      notes: {
        eventId: event._id.toString(),
        userId: req.user.id
      }
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      eventName: event.title,
      description: event.description
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Verify Razorpay payment and register user
export const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated_signature !== razorpay_signature) {
    return res.status(400).json({ message: "Invalid payment signature" });
  }

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const alreadyRegistered = event.registrations.some(
      (reg) => reg.user.toString() === req.user.id
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    event.registrations.push({
      user: req.user.id,
      registeredAt: new Date(),
      paymentStatus: "paid",
      paymentId: razorpay_payment_id,
      ticketId: `ticket_${Date.now()}`,
    });

    if (event.seatsAvailable > 0) event.seatsAvailable -= 1;

    await event.save();

    res.json({ message: "Payment verified and registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Free event registration
export const registerFreeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.ticketPrice > 0) {
      return res.status(400).json({ message: "This is a paid event. Use /create-order." });
    }

    const alreadyRegistered = event.registrations.some(
      (reg) => reg.user.toString() === req.user.id
    );
    if (alreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    event.registrations.push({
      user: req.user.id,
      registeredAt: new Date(),
      paymentStatus: "free",
      ticketId: `ticket_${Date.now()}`,
    });

    if (event.seatsAvailable > 0) event.seatsAvailable -= 1;

    await event.save();

    res.json({ message: "Successfully registered for the free event" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
