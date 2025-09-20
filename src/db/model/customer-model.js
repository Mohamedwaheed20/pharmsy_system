import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  notes: {
    type: String,
  }
}, { timestamps: true });

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
export default Customer;
