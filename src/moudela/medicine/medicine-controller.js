import { Router } from "express";
import * as medicineService from "./service/medicine-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import { authantication_middelware } from "../../middelware/authantication-middelware.js";

const medicineController = Router();

medicineController.post("/create", authantication_middelware(), errorHandler(medicineService.createMedicineController));
medicineController.get("/getall",authantication_middelware(), errorHandler(medicineService.getAllMedicinesController));
medicineController.get("/get/:_id",authantication_middelware(), errorHandler(medicineService.getMedicineByIdController));
medicineController.put("/update/:_id",authantication_middelware(), errorHandler(medicineService.updateMedicineController));
medicineController.delete("/delete/:_id",authantication_middelware(), errorHandler(medicineService.deleteMedicineController));

export default medicineController;
