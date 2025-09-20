import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  medicines: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Pending", "Cancelled"],
    default: "Pending",
  }
}, { timestamps: true });

const Sale = mongoose.models.Sale || mongoose.model("Sale", salesSchema);
export default Sale;
