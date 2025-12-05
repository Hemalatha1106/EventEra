import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    registeredEvents: [        
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
}, { timestamps: true });

export default mongoose.model("Admin", adminSchema);
