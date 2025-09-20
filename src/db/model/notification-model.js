// database/models/notification-model.js
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: String,
  status: { type: String, enum: ["unread", "read"], default: "unread" },
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
