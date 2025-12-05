import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredEvents: [                   // ✅ must be an array
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
}, { timestamps: true });

// Pre-save hook for password hashing
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.model("User", userSchema);
