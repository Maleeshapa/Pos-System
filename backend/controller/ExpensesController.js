const Expenses = require("../model/Expenses");
const ExpensesCat = require("../model/ExpensesCat");
const User = require("../model/User");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Image upload setup for expenses
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'expenses');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const expensesRef = req.body.expensesRef || 'expense';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);

        const safeExpensesRef = expensesRef.replace(/[^a-zA-Z0-9]/g, '_');

        cb(null, `${safeExpensesRef}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('expensesImage');

// Create Expense 
const createExpense = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const {
                expensesRef,
                expensesNote,
                expensesAmount,
                expensesDate,
                expensesCatId,
                userId
            } = req.body;

            // Validate input fields
            if (!expensesRef || !expensesNote || !expensesAmount || !expensesDate || !expensesCatId || !userId) {
                return res.status(400).json({ error: "All fields are required." });
            }

            // Validate Expenses Category
            const expensesCat = await ExpensesCat.findByPk(expensesCatId);
            if (!expensesCat) {
                return res.status(400).json({ message: 'Invalid Expenses Category ID' });
            }

            // Validate User
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json({ message: 'Invalid User ID' });
            }

            // Check for existing ExpensesRef
            const existingExpenses = await Expenses.findOne({ where: { expensesRef } });
            if (existingExpenses) {
                return res.status(409).json({ error: "Expenses Ref Number already exists." });
            }

            // Handle image upload
            let expensesImage = null;
            if (req.file) {
                expensesImage = `${req.protocol}://${req.get('host')}/uploads/expenses/${req.file.filename}`;
            }

            // Create new expense entry
            const newExpenses = await Expenses.create({
                expensesRef,
                expensesNote,
                expensesAmount,
                expensesDate,
                expensesImage,
                expensesCat_expensesCatId: expensesCatId,
                user_userId: userId,
            });

            // Fetch newly created expenses with Expenses Category and User
            const expensesWithDetails = await Expenses.findByPk(newExpenses.expensesId, {
                include: [
                    {
                        model: ExpensesCat,
                        as: 'expensesCat'
                    },
                    {
                        model: User,
                        as: 'user'
                    },
                ]
            });

            res.status(201).json(expensesWithDetails);
        } catch (error) {
            if (error.name === "SequelizeValidationError") {
                return res.status(400).json({ error: "Validation error: Please check the provided data." });
            }
            if (error.name === "SequelizeUniqueConstraintError") {
                return res.status(409).json({ error: "Expense already exists." });
            }
            return res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
        }
    });
};

// Get all expenses
const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expenses.findAll({
            include: [
                {
                    model: ExpensesCat,
                    as: 'expensesCat'
                },
                {
                    model: User,
                    as: 'user'
                },
            ]
        });
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get expenses by ID
const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const expenses = await Expenses.findByPk(id, {
            include: [
                {
                    model: ExpensesCat,
                    as: 'expensesCat'
                },
                {
                    model: User,
                    as: 'user'
                },
            ]
        });

        if (!expenses) {
            return res.status(404).json({ message: 'Expenses not found' });
        }
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Update an expense
const updateExpense = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Multer error: Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const { id } = req.params;
            const {
                expensesRef,
                expensesNote,
                expensesAmount,
                expensesDate,
                expensesCatId,
                userId
            } = req.body;

            // Fetch the existing expense
            const expense = await Expenses.findByPk(id);
            if (!expense) {
                return res.status(404).json({ message: 'Expense not found' });
            }

            // Validate Expenses Category
            const expensesCat = await ExpensesCat.findByPk(expensesCatId);
            if (!expensesCat) {
                return res.status(400).json({ message: 'Invalid Expenses Category ID' });
            }

            // Validate User
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(400).json({ message: 'Invalid User ID' });
            }

            // Check if a new image is uploaded and delete the old one
            let expensesImage = expense.expensesImage;
            if (req.file) {
                // If an old image exists, delete it
                const oldImagePath = expensesImage
                    ? path.join(__dirname, '..', 'uploads', 'expenses', path.basename(expensesImage))
                    : null;

                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                // Update the expenses image with the new one
                expensesImage = `${req.protocol}://${req.get('host')}/uploads/expenses/${req.file.filename}`;
            }

            // Update the expense details
            await expense.update({
                expensesRef,
                expensesNote,
                expensesAmount,
                expensesDate,
                expensesImage,
                expensesCat_expensesCatId: expensesCatId,
                user_userId: userId,
            });

            // Fetch the updated expense with its associated category and user
            const updatedExpense = await Expenses.findByPk(id, {
                include: [
                    { model: ExpensesCat, as: 'expensesCat' },
                    { model: User, as: 'user' },
                ]
            });

            res.status(200).json(updatedExpense);
        } catch (error) {
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    });
};

// Delete an expense
const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expenses.findByPk(id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Delete expense image if exists
        const expenseImagePath = expense.expensesImage
            ? path.join(__dirname, '..', 'uploads', 'expenses', path.basename(expense.expensesImage))
            : null;

        if (expenseImagePath && fs.existsSync(expenseImagePath)) {
            fs.unlinkSync(expenseImagePath); // Synchronously remove the image
        }

        // Delete the expense
        await expense.destroy();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

module.exports = {
    createExpense,
    getAllExpenses,
    getExpenseById,
    updateExpense,
    deleteExpense,
};
