// database/models/medicine-model.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  quantity: { type: Number, default: 0 }, 
  expirydate: { type: Date },
  price: { type: Number, required: true },
  manufacturer: String,
  image: String, 
}, { timestamps: true });

const Medicine = mongoose.models.Medicine || mongoose.model("Medicine", medicineSchema);
export default Medicine;
