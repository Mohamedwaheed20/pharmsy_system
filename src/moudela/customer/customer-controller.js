import { Router } from "express";
import * as customerService from "./service/customer-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const customerController = Router();

    customerController.post("/create", errorHandler(customerService.createCustomerService));
    customerController.get("/getall", errorHandler(customerService.getAllCustomerService));
    customerController.get("/get/:id", errorHandler(customerService.getCustomerServiceById));
    customerController.put("/update/:id", errorHandler(customerService.updateCustomerService));
    customerController.delete("/delete/:id", errorHandler(customerService.deleteCustomerService));

export default customerController;
