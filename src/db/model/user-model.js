import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "pharmacist", "customer"],
    default: "customer"
  },
  otp:{
    type:String
  },
  confirmotp:{
    type:String
  },
  isverified:{
    type:Boolean,
    default:false
  },
  phone:{
    type:String
  }
}, { timestamps: true });


const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
