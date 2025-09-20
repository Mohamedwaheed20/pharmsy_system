import Customer from "../../../db/model/customer-model.js";


export const createCustomerService = async (req, res, next) => {
    try {
       const { name, email,dateOfBirth,phone,address,notes } = req.body;
       const isUserExist = await Customer.findOne({ email });
       if (isUserExist) {
         return next(new Error("User already exist"));
       }
       const customer = await Customer.create({
           name,
           email,
           dateOfBirth,
           phone,
           address,
           notes
       });
        res.status(201).json({ message: "Customer created successfully", customer });
    } catch (error) {
        next(error);
    }

};

export const getCustomerServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json({ message: "Customer fetched successfully", customer });
    } catch (error) {
        next(error);
    }
};
export const getAllCustomerService = async (req, res, next) => {
    try {
        const customers = await Customer.find();
        res.status(200).json({ message: "Customers fetched successfully", customers });
    } catch (error) {
        next(error);
    }
};

export const updateCustomerService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email,dateOfBirth,phone,address,notes } = req.body;
      
        const customer = await Customer.findByIdAndUpdate(id, { name, email,dateOfBirth,phone,address,notes }, { new: true });
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json({ message: "Customer updated successfully", customer });
    } catch (error) {
        next(error);
    }
};

export const deleteCustomerService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByIdAndDelete(id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        next(error);
    }
};
