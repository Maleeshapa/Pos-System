const Customer = require("../model/Customers");

const createCustomer = async (req, res) => {
    try {
        const {
            cusTitle,
            cusName,
            cusCode,
            cusAddress,
            cusPhone,
            cusEmail,
            cusNIC,
            cusCity,
            cusJob,
            cusCompany,
            cusWorkPlaceTP,
            cusWorkPlaceAddress
        } = req.body;

        if (
            !cusTitle ||
            !cusName ||
            !cusCode ||
            !cusAddress ||
            !cusPhone ||
            !cusNIC
        ) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existingCustomer = await Customer.findOne({ where: { cusNIC } });
        if (existingCustomer) {
            return res
                .status(400)
                .json({ error: "A Customer with this NIC already exists." });
        }
        const newCustomer = await Customer.create({
            cusTitle,
            cusName,
            cusCode,
            cusAddress,
            cusPhone,
            cusEmail,
            cusNIC,
            cusCity,
            cusJob,
            cusCompany,
            cusWorkPlaceTP,
            cusWorkPlaceAddress,
            cusPoints: "10",
            cusStatus: "Active",
        });
        res.status(201).json(newCustomer);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res
                .status(400)
                .json({ error: "Validation error: Please check the provided data." });
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                error:
                    "Duplicate field value: A Customer with this email,Nic or name already exists.",
            });
        }

        res.status(400).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get all customer
const getAllCustomers = async (req, res) => {
    try {
        const customer = await Customer.findAll();
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single customer by ID
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCustomerByNic = async (req, res) => {
    try {
        const { nic } = req.params; 

        const customer = await Customer.findOne({
            where: { cusNIC: nic }
        });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a customer
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            cusTitle,
            cusName,
            cusCode,
            cusAddress,
            cusPhone,
            cusEmail,
            cusNIC,
            cusCity,
            cusJob,
            cusCompany,
            cusWorkPlaceTP,
            cusWorkPlaceAddress,
            cusPoints,
            cusStatus,
        } = req.body;

        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        await customer.update({
            cusTitle,
            cusName,
            cusCode,
            cusAddress,
            cusPhone,
            cusEmail,
            cusNIC,
            cusCity,
            cusJob,
            cusCompany,
            cusWorkPlaceTP,
            cusWorkPlaceAddress,
            cusPoints,
            cusStatus,
        });

        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findByPk(id);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        await customer.destroy();
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerByNic
}