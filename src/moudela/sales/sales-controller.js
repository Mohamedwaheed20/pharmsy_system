import { Router } from "express";
import * as salesService from "./service/sales-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";

const salesController = Router();

salesController.post("/create", errorHandler(salesService.createSaleService));
salesController.get("/getall", errorHandler(salesService.getAllSalesService));
salesController.get("/get/:id", errorHandler(salesService.getSaleServiceById));
salesController.put("/update/:id", errorHandler(salesService.updateSaleService));
salesController.delete("/delete/:id", errorHandler(salesService.deleteSaleService));

export default salesController;
