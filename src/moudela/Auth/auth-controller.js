import { Router } from "express";
import * as authService from "./service/auth-service.js"; // 🟩 كل السيرفيس اللي كتبناها فوق
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const authController = Router();

// 🟩 Register / Signup
authController.post("/signup", errorHandler(authService.signupService));

authController.post("/signin", errorHandler(authService.signinService));

authController.post("/verifyotp", errorHandler(authService.verifyotpService));

authController.post("/signout", errorHandler(authService.signoutService));


authController.post("/forgetpassword", errorHandler(authService.forgetpasswordService));

authController.post("/resetpassword", errorHandler(authService.resetpasswordService));

export default authController;
