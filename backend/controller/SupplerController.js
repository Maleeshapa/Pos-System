const Supplier = require("../model/Supplier");

const createSupplier = async (req, res) => {
    try {
        const {
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
        } = req.body;

        if (
            !supplierName ||
            !supplierAddress ||
            !supplierNic ||
            !supplierEmail ||
            !supplierTP
        ) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const existingSupplier = await Supplier.findOne({ where: { supplierNic } });
        if (existingSupplier) {
            return res
                .status(400)
                .json({ error: "A Supplier with this NIC already exists." });
        }

        const newSupplier = await Supplier.create({
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
            supplierStatus: "Active",
        });

        res.status(201).json(newSupplier);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res
                .status(400)
                .json({ error: "Validation error: Please check the provided data." });
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                error:
                    "Duplicate field value: A Supplier with this email,Nic or name already exists.",
            });
        }

        res.status(400).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get all Suppliers
const getAllSuppliers = async (req, res) => {
    try {
        const supplier = await Supplier.findAll();
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single Supplier by ID
const getSupplierById = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        res.status(200).json(supplier);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Supplier
const updateSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
            supplierStatus
        } = req.body;

        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        await supplier.update({
            supplierName,
            supplierAddress,
            supplierNic,
            supplierEmail,
            supplierTP,
            supplierSecondTP,
            supplierStatus
        });

        res.status(200).json(supplier);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Supplier
const deleteSupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await Supplier.findByPk(id);
        if (!supplier) {
            return res.status(404).json({ message: "Supplier not found" });
        }
        await supplier.destroy();
        res.status(200).json({ message: "Supplier deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
}
