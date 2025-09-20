import Medicine from "../../../db/model/medicine-model.js";

// ➕ إضافة دواء جديد
export const createMedicineController = async (req, res, next) => {
  try {
    const { name, description, price, quantity, expiry_date, manufacturer } = req.body;

    const medicine = await Medicine.create({
      name,
      description,
      price,
      quantity,
      expiry_date,
      manufacturer,
    });

    res.status(201).json({ message: "Medicine created successfully", medicine });
  } catch (error) {
    next(error);
  }
};

// 📄 عرض كل الأدوية
export const getAllMedicinesController = async (req, res, next) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (error) {
    next(error);
  }
};

export const getMedicineByIdController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const medicine = await Medicine.findById(_id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json(medicine);
  } catch (error) {
    next(error);
  }
};

export const updateMedicineController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { name, description, price, quantity, expiry_date, manufacturer } = req.body;

    const medicine = await Medicine.findByIdAndUpdate(
      _id,
      { name, description, price, quantity, expiry_date, manufacturer },
      { new: true }
    );

    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ message: "Medicine updated successfully", medicine });
  } catch (error) {
    next(error);
  }
};

// 🗑️ حذف دواء
export const deleteMedicineController = async (req, res, next) => {
  try {
    const { _id } = req.params;
    const medicine = await Medicine.findByIdAndDelete(_id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });

    res.status(200).json({ message: "Medicine deleted successfully" });
  } catch (error) {
    next(error);
  }
};
 