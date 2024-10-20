const Transaction = require("../model/Transaction");
const Invoice = require("../model/Invoice");
const User =require("../model/User")

const createTransaction = async (req, res) => {
    try {
        const {
            transactionType,
            price,
            dateTime,
            discount,
            note,
            paid,
            due,
            invoiceId,
            userId,
        } = req.body;

        if (!transactionType || !price || !dateTime) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate invoice
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            return res.status(400).json({ message: 'Invalid invoice ID' });
        }

        // Validate user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        // Create the transaction
        const newTransaction = await Transaction.create({
            transactionType,
            price,
            dateTime,
            discount,
            note,
            paid,
            due,
            invoice_invoiceId: invoiceId,
            user_userId: userId,
        });

        res.status(201).json(newTransaction);
    } catch (error) {
        console.error('Transaction creation error:', error);
        res.status(500).json({ message: 'An error occurred while creating the transaction.' });
    }
};



// Get all transactions
const getAllTransactions = async (req, res) => {
    try {
        const transaction = await Transaction.findAll();
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single transaction by ID
const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByPk(id)
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
};