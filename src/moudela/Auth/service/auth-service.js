import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { BlackListToken } from "../../../db/model/BlackListToken-model.js";
import { emitter } from "../../../service/send-email.js";
import User from "../../../db/model/user-model.js";

// 🟩 Register / Signup
export const signupService = async (req, res, next) => {
  try {
    const { username, email, password, role, phone } = req.body;

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return next(new Error("User already exist"));
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedotp = hashSync(otp.toString(), 10);

    emitter.emit("sendemail", {
      email,
      subject: "Welcome to Pharmacy System",
      html: `<h1>Your OTP is: ${otp}</h1>`,
    });

    const hashedpassword = hashSync(password, 10);

    const user = new User({
      username,
      email,
      password: hashedpassword,
      role,
      phone,
      otp: hashedotp,
    });
    await user.save();

    console.log("OTP generated:", otp);

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const signinService = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordMatched =   compareSync(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accesstoken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.jwt_accesstoken,
      { expiresIn: "2h", jwtid: uuidv4() }
    );

    const refreshtoken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.jwt_refreshtoken,
      { expiresIn: "1d", jwtid: uuidv4() }
    );

    res.status(200).json({
      message: "User signed in successfully",
      accesstoken,
      refreshtoken,
    });
  } catch (error) {
    next(error);
  }
};

// 🟩 Verify OTP
export const verifyotpService = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otp) {
      return res.status(400).json({ message: "OTP not set for this user" });
    }

    const isotpMatched = compareSync(otp.toString(), user.otp);
    if (!isotpMatched) return res.status(400).json({ message: "Invalid OTP" });

    await User.findByIdAndUpdate(user._id, {
      isverified: true,
      $unset: { otp: "" },
    });

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    next(error);
  }
};

// 🟩 Logout
export const signoutService = async (req, res, next) => {
  try {
    const { accesstoken, refreshtoken } = req.headers;

    const decodedaccesstoken = jwt.verify(
      accesstoken,
      process.env.jwt_accesstoken
    );
    const decodedrefreshtoken = jwt.verify(
      refreshtoken,
      process.env.jwt_refreshtoken
    );

    const revokedtoken = await BlackListToken.insertMany([
      {
        tokenid: decodedaccesstoken.jti,
        expirydate: new Date(decodedaccesstoken.exp * 1000),
      },
      {
        tokenid: decodedrefreshtoken.jti,
        expirydate: new Date(decodedrefreshtoken.exp * 1000),
      },
    ]);

    if (!revokedtoken) {
      throw new Error("Token not revoked");
    }

    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

// 🟩 Forget Password
export const forgetpasswordService = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const hashedotp = hashSync(otp.toString(), 10);
    await User.findByIdAndUpdate(user._id, { confirmotp: hashedotp });

    emitter.emit("sendemail", {
      email,
      subject: "Reset Password OTP",
      html: `<h1>${otp}</h1>`,
    });

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    next(error);
  }
};

// 🟩 Reset Password
export const resetpasswordService = async (req, res, next) => {
  try {
    const { email, otp, password, confirmpassword } = req.body;

    if (!email || !otp || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.confirmotp) {
      return res.status(400).json({ message: "OTP not set or expired" });
    }

    const isOtpMatched = compareSync(otp.toString(), user.confirmotp);
    if (!isOtpMatched) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Password not matched" });
    }

    const hashedpassword = hashSync(password, 10);

    await User.updateOne(
      { email },
      { password: hashedpassword, $unset: { confirmotp: "" } }
    );

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    next(error);
  }
};
