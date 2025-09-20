import { globalErrorHandler } from "../middelware/error-handler-middelware.js";
import medicineController from "../moudela/medicine/medicine-controller.js";
import authController from "../moudela/Auth/auth-controller.js";
import customerController from "../moudela/customer/customer-controller.js";
import salesController from "../moudela/sales/sales-controller.js";
import prescriptionController from "../moudela/Prescription/Prescription-controller.js";
import dashboardController from "../utilits/dashboard-controller.js";
import morgan from "morgan";
const routerHandler=(app)=>{

    app.use("/medicine",medicineController)
    app.use("/auth",authController)
    app.use("/customers",customerController)
    app.use("/sales",salesController)
    app.use("/prescriptions",prescriptionController)
    app.use("/dashboard",dashboardController)
    app.use(morgan('dev')); // أو 'combined' لو عايز شكل Apache Logs

    app.use(globalErrorHandler)
 }
 
 export default routerHandler;