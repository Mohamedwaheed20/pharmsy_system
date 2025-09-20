import Sale from "../../../db/model/sales-model.js";
import Medicine from "../../../db/model/medicine-model.js";
import Customer from "../../../db/model/customer-model.js";

// ➕ إنشاء عملية بيع جديدة
export const createSaleService = async (req, res, next) => {
    try {
      const { customer, medicines, status } = req.body;
  
      // ✅ حساب السعر الكلي
      let totalPrice = 0;
      const saleMedicines = [];
  
      for (const item of medicines) {
        const med = await Medicine.findById(item.medicine);
        if (!med) {
          return res.status(404).json({ message: `Medicine not found: ${item.medicine}` });
        }
  
        const itemPrice = med.price * item.quantity;
        totalPrice += itemPrice;
  
        saleMedicines.push({
          medicine: med._id,
          quantity: item.quantity,
          price: med.price // السعر الفردي علشان لو حبيت تعرضه بعدين
        });
      }
  
      // إنشاء بيع جديد
      const sale = await Sale.create({
        customer,
        medicines: saleMedicines,
        totalPrice,
        status
      });
  
      res.status(201).json({ message: "Sale created successfully", sale });
    } catch (error) {
      next(error);
    }
  };

// 📄 عرض كل عمليات البيع
export const getAllSalesService = async (req, res, next) => {
  try {
    const sales = await Sale.find()
      .populate("customer", "name email phone")
      .populate("medicines.medicine", "name price");
    res.status(200).json({ message: "Sales fetched successfully", sales });
  } catch (error) {
    next(error);
  }
};

// 📄 عرض عملية بيع واحدة
export const getSaleServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findById(id)
      .populate("customer", "name email phone")
      .populate("medicines.medicine", "name price");
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json({ message: "Sale fetched successfully", sale });
  } catch (error) {
    next(error);
  }
};

// ✏️ تعديل عملية بيع
export const updateSaleService = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { customer, medicines, status } = req.body;
  
      // ✅ حساب السعر الكلي من جديد
      let totalPrice = 0;
      const saleMedicines = [];
  
      for (const item of medicines) {
        const med = await Medicine.findById(item.medicine);
        if (!med) {
          return res.status(404).json({ message: `Medicine not found: ${item.medicine}` });
        }
        const itemPrice = med.price * item.quantity;
        totalPrice += itemPrice;
  
        saleMedicines.push({
          medicine: med._id,
          quantity: item.quantity,
          price: med.price // تحب تحفظ السعر الفردي للرجوع ليه بعدين
        });
      }
  
      // تحديث البيع
      const sale = await Sale.findByIdAndUpdate(
        id,
        {
          customer,
          medicines: saleMedicines,
          totalPrice,
          status
        },
        { new: true }
      );
  
      if (!sale) return res.status(404).json({ message: "Sale not found" });
  
      res.status(200).json({ message: "Sale updated successfully", sale });
    } catch (error) {
      next(error);
    }
  };
  

// 🗑️ حذف عملية بيع
export const deleteSaleService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await Sale.findByIdAndDelete(id);
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (error) {
    next(error);
  }
};
