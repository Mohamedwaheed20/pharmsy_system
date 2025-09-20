import Medicine from "../../../db/model/medicine-model.js";
import Prescription from "../../../db/model/Prescription-model.js";

// ➕ إنشاء روشتة جديدة
export const createPrescriptionService = async (req, res, next) => {
  try {
    const { customer, doctor, medicines, notes, status } = req.body;

    // نتأكد كل الأدوية موجودة
    const prescriptionMedicines = [];
    for (const item of medicines) {
      const med = await Medicine.findById(item.medicine);
      if (!med) {
        return res
          .status(404)
          .json({ message: `Medicine not found: ${item.medicine}` });
      }

      prescriptionMedicines.push({
        medicine: med._id,
        quantity: item.quantity,
        dosage: item.dosage,
      });
    }

    const prescription = await Prescription.create({
      customer,
      doctor,
      medicines: prescriptionMedicines,
      notes,
      status,
    });

    res.status(201).json({ message: "Prescription created successfully", prescription });
  } catch (error) {
    next(error);
  }
};

// 📄 عرض كل الروشتات
export const getAllPrescriptionsService = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("customer")
      .populate("medicines.medicine");
    res.status(200).json({ message: "Prescriptions fetched successfully", prescriptions });
  } catch (error) {
    next(error);
  }
};

// 📄 عرض روشتة واحدة
export const getPrescriptionByIdService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id)
      .populate("customer")
      .populate("medicines.medicine");
    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });
    res
      .status(200)
      .json({ message: "Prescription fetched successfully", prescription });
  } catch (error) {
    next(error);
  }
};

// ✏️ تعديل روشتة
export const updatePrescriptionService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customer, doctor, medicines, notes, status } = req.body;

    const prescriptionMedicines = [];
    for (const item of medicines) {
      const med = await Medicine.findById(item.medicine);
      if (!med) {
        return res
          .status(404)
          .json({ message: `Medicine not found: ${item.medicine}` });
      }

      prescriptionMedicines.push({
        medicine: med._id,
        quantity: item.quantity,
        dosage: item.dosage,
      });
    }

    const prescription = await Prescription.findByIdAndUpdate(
      id,
      { customer, doctor, medicines: prescriptionMedicines, notes, status },
      { new: true }
    )
      .populate("customer")
      .populate("medicines.medicine");

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    res.status(200).json({ message: "Prescription updated successfully", prescription });
  } catch (error) {
    next(error);
  }
};

// 🗑️ حذف روشتة
export const deletePrescriptionService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findByIdAndDelete(id);
    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });
    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    next(error);
  }
};
