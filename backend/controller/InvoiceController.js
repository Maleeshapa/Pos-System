const Invoice = require("../model/Invoice");
const Customer = require("../model/Customers");
const Product = require("../model/Products");
const Stock = require("../model/Stock");

// Create invoice
const createInvoice = async (req, res) => {
    try {
        const {
            invoiceNo,
            invoiceDate,
            cusId,
        } = req.body;

        // Validate required fields
        if (!invoiceDate ) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if customer exists
        const customer = await Customer.findByPk(cusId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }

        // Create a new invoice
        const newInvoice = await Invoice.create({
            invoiceNo,
            invoiceDate,
            customer_cusId: cusId,
        });

        // Fetch newly created invoice information
        const invoiceDetails = await Invoice.findByPk(newInvoice.invoiceId, {
            include: [
                { model: Customer, as: 'customer' },
            ],
        });

        res.status(201).json(invoiceDetails);
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            console.error('Validation errors:', error.errors);
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }
        return res.status(500).json({ error: `An internal error occurred: ${error.message}` });
    }
};

const getAllInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            include: [
                { model: Product, as: 'product' },
                { model: Customer, as: 'customer' },
                { model: Stock, as: 'stock' },
            ],
        });

        if (invoices.length === 0) {
            return res.status(404).json({ message: "No invoices found" });
        }

        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get invoice by id with customer and product details
const getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id, {
            include: [
                { model: Product, as: 'product' },
                { model: Customer, as: 'customer' },
                { model: Stock, as: 'stock' },
            ],
        });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getInvoiceByNo = async (req, res) => {
    try {
        const { num } = req.params;

        const invoice = await Invoice.findOne({
            where: { invoiceNo: num }
        });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update invoice
const updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            invoiceNo,
            invoiceDate,
            totalAmount,
            invoiceQty,
            productId,
            cusId,
        } = req.body;

        // Check if customer exists
        const customer = await Customer.findByPk(cusId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }

        if (productId) {
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ message: "Invalid product ID" });
            }
        }

        const invoice = await Invoice.findByPk(id);
        if (invoice) {
            await invoice.update({
                invoiceNo,
                invoiceDate,
                totalAmount,
                invoiceQty,
                products_productId: productId,
                customer_cusId: cusId,
            });
            res.status(200).json(invoice);
        } else {
            res.status(404).json({ message: "Invoice not found" });
        }
    } catch (error) {
        res.status(500).json({ message: `An error occurred: ${error.message}` });
    }
};
// Delete a Invoice
const deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }
        await invoice.destroy();
        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createInvoice,
    getAllInvoice,
    getInvoiceById,
    getInvoiceByNo,
    updateInvoice,
    deleteInvoice,
};
