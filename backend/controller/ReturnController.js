const Customer = require("../model/Customers");
const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Return = require("../model/Return");
const Store = require("../model/Store");
const User = require("../model/User");

const createReturn = async (req, res) => {
    try {
        const {
            returnItemType,
            returnItemDate,
            returnQty,
            returnNote,
            productId,
            storeId,
            userId,
            invoiceId,
            cusId,
        } = req.body;

        // Ensure all required fields are present
        if (!returnItemType || !returnItemDate || !productId || !storeId || !userId || !invoiceId || !cusId) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if product exists
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Check if store exists
        const store = await Store.findByPk(storeId);
        if (!store) {
            return res.status(400).json({ message: 'Invalid store ID' });
        }

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Check if customer exists
        const customer = await Customer.findByPk(cusId);
        if (!customer) {
            return res.status(400).json({ message: 'Invalid customer ID' });
        }

        // Check if invoice exists
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            return res.status(400).json({ message: 'Invalid invoice ID' });
        }

        // Create the return
        const newReturn = await Return.create({
            returnItemType,
            returnItemDate,     
            returnQty,
            returnNote,
            products_productId: productId,
            store_storeId: storeId,
            user_userId: userId,
            invoice_invoiceId: invoiceId,
            customer_cusId: cusId,
        });

        // Fetch the newly created return with associated product, store, user, and invoice information
        const returnWithAssociations = await Return.findByPk(newReturn.returnItemId, {
            include: [
                { model: Product, as: 'products' },
                { model: Store, as: 'store' },
                { model: User, as: 'user' },
                { model: Invoice, as: 'invoice' },
                { model: Customer, as: 'customer' }, 
            ],
        });

        // Send the created return data as a response
        res.status(201).json(returnWithAssociations);
    } catch (error) {
        return res.status(500).json({ message: `An internal error occurred: ${error.message}` });
    }
};

// Get all returns
const getAllReturns = async (req, res) => {
    try {
        const returns = await Return.findAll({
            include: [
                { model: Product, as: 'products' },
                { model: Store, as: 'store' },
                { model: User, as: 'user' },
                { model: Invoice, as: 'invoice' },
            ],
        });
        res.status(200).json(returns);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get a return by ID
const getReturnById = async (req, res) => {
    try {
        const { id } = req.params;
        const returns = await Return.findByPk(id, {
            include: [
                { model: Product, as: 'products' },
                { model: Store, as: 'store' },
                { model: User, as: 'user' },
                { model: Invoice, as: 'invoice' },
            ],
        });

        if (returns) {
            res.status(200).json(returns);
        } else {
            res.status(404).json({ message: 'Return not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createReturn,
    getAllReturns,
    getReturnById,
}