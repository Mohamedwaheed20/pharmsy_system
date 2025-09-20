import { Router } from "express";
import * as prescriptionService from "./service/Prescription-service.js";
import { errorHandler } from "../../middelware/error-handler-middelware.js";
import { authantication_middelware } from "../../middelware/authantication-middelware.js";

const prescriptionController = Router();

prescriptionController.post(
  "/create",
  authantication_middelware(),
  errorHandler(prescriptionService.createPrescriptionService)
);
prescriptionController.get(
  "/getall",
  authantication_middelware(),
  errorHandler(prescriptionService.getAllPrescriptionsService)
);
prescriptionController.get(
  "/get/:id",
  authantication_middelware(),
  errorHandler(prescriptionService.getPrescriptionByIdService)
);
prescriptionController.put(
  "/update/:id",
  authantication_middelware(),
  errorHandler(prescriptionService.updatePrescriptionService)
);
prescriptionController.delete(
  "/delete/:id",
  authantication_middelware(),
  errorHandler(prescriptionService.deletePrescriptionService)
);

export default prescriptionController;
