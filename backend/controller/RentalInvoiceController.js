const Customer = require("../model/Customers");
const Product = require("../model/Products");
const RentalInvoice = require("../model/RentalInvoice");

const createRentalInvoice = async (req, res) => {
    try {
        const {
            rentalInvoiceDate,
            rentalInvoiceTotalAmount,
            rentalInvoiceAdvancePayment,
            rentalInvoiceNote,
            cusId,
            productId,
        } = req.body;

        if (!rentalInvoiceDate || !rentalInvoiceTotalAmount || !rentalInvoiceAdvancePayment || !rentalInvoiceNote || !cusId || !productId) {
            return res.Status(400).json({ error: "All fields are required." });
        }
        // Validate customer
        const customer = await Customer.findByPk(cusId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }

        // Validate product
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        const newRInvoice = await RentalInvoice.create({
            rentalInvoiceDate,
            rentalInvoiceTotalAmount,
            rentalInvoiceAdvancePayment,
            rentalInvoiceNote,
            customer_cusId: cusId,
            products_productId: productId,
        });
        const RInvoiceWithDetails = await RentalInvoice.findByPk(newRInvoice.rentalInvoiceId, {
            include: [
                { model: Customer, as: 'customer' },
                { model: Product, as: 'product' },
            ],
        });

        res.status(201).json(RInvoiceWithDetails);

    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }
        return res.status(500).json({ error: `An internal server error occurred: ${error.message}` }); F
    }
};

// Get all rental invoices
const getAllRentalInvoices = async (req, res) => {
    try {
        const rentalInvoice = await RentalInvoice.findAll({
            include: [
                { model: Customer, as: 'customer' },
                { model: Product, as: 'product' },
            ],
        });
        res.status(200).json(rentalInvoice);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get rental invoice by ID
const getRentalInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const rentalInvoice = await RentalInvoice.findByPk(id, {
            include: [
                { model: Customer, as: 'customer' },
                { model: Product, as: 'product' },
            ],
        });

        if (!rentalInvoice) {
            return res.status(404).json({ message: 'Rental Invoice not found' });
        }
        res.status(200).json(rentalInvoice);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Update a rental invoice
const updateRentalInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            rentalInvoiceDate,
            rentalInvoiceTotalAmount,
            rentalInvoiceAdvancePayment,
            rentalInvoiceNote,
            cusId,
            productId,
        } = req.body;

        const rentalInvoice = await RentalInvoice.findByPk(id);
        if (!rentalInvoice) {
            return res.status(404).json({ message: "Rental Invoice not found" });
        }

        await rentalInvoice.update({
            rentalInvoiceDate,
            rentalInvoiceTotalAmount,
            rentalInvoiceAdvancePayment,
            rentalInvoiceNote,
            customer_cusId: cusId,
            products_productId: productId,
        });

        res.status(200).json(rentalInvoice);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a rental invoice
const deleteRentalInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const rentalInvoice = await RentalInvoice.findByPk(id);
        if (!rentalInvoice) {
            return res.status(404).json({ message: "Rental Invoice not found" });
        }
        await rentalInvoice.destroy();
        res.status(200).json({ message: "Rental Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createRentalInvoice,
    getAllRentalInvoices,
    getRentalInvoiceById,
    updateRentalInvoice,
    deleteRentalInvoice,
};