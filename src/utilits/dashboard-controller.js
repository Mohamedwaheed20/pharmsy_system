import { Router } from "express";
import Medicine from "../db/model/medicine-model.js";
import Customer from "../db/model/customer-model.js";
import Sale from "../db/model/sales-model.js";


const dashboardController = Router();

dashboardController.get("/stats", async (req, res, next) => {
    try {
        // ✅ العدادات الأساسية
        const customersCount = await Customer.countDocuments();
        const medicinesCount = await Medicine.countDocuments();
        const salesCount = await Sale.countDocuments();
    
        // ✅ إجمالي الإيرادات
        const sales = await Sale.find();
        const totalRevenue = sales.reduce((acc, sale) => acc + (sale.totalPrice || 0), 0);
    
        // ✅ الإيرادات اليومية
        const dailyRevenue = await Sale.aggregate([
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
              },
              total: { $sum: "$totalPrice" }
            }
          },
          { $sort: { _id: 1 } }
        ]);
    
        // ✅ Top Medicines
        const topMedicines = await Sale.aggregate([
          { $unwind: "$medicines" }, // نفك المصفوفة
          {
            $group: {
              _id: "$medicines.medicine",
              totalQuantity: { $sum: "$medicines.quantity" },
              countSales: { $sum: 1 } // عدد مرات البيع
            }
          },
          {
            $lookup: {
              from: "medicines", // اسم Collection
              localField: "_id",
              foreignField: "_id",
              as: "medicineInfo"
            }
          },
          { $unwind: "$medicineInfo" },
          {
            $project: {
              _id: 0,
              medicineId: "$_id",
              name: "$medicineInfo.name",
              price: "$medicineInfo.price",
              totalQuantity: 1,
              countSales: 1
            }
          },
          { $sort: { totalQuantity: -1 } }, // ترتيب تنازلي
          { $limit: 5 } // 👈 أهم 5 أدوية فقط
        ]);
    
        res.status(200).json({
          customersCount,
          medicinesCount,
          salesCount,
          totalRevenue,
          dailyRevenue,
          topMedicines
        });
      } catch (error) {
        next(error);
      }
    });
export default dashboardController;
