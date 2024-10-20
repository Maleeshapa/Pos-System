const ExpensesCat = require("../model/ExpensesCat");

const createExpensesCategory = async (req, res) => {
    try {
        const { expensesCatName, expensesCatType } = req.body;

        // Validate required fields
        if (!expensesCatName || !expensesCatType) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Check if the category name already exists
        const existingExpensesCat = await ExpensesCat.findOne({ where: { expensesCatName } });
        if (existingExpensesCat) {
            return res.status(409).json({ error: "Category name already exists." }); // Changed status to 409 Conflict
        }

        // Create new expense category
        const newExpensesCat = await ExpensesCat.create({
            expensesCatName,
            expensesCatType,
        });

        // Return success response
        return res.status(201).json({ message: "Category created successfully.", newExpensesCat });
    } catch (error) {
        // Handle Sequelize validation errors
        if (error.name === "SequelizeValidationError") {
            return res.status(400).json({ error: "Validation error: Please check the provided data." });
        }

        // Handle Sequelize unique constraint errors
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(409).json({ error: "Category already exists." });
        }

        // Catch all other errors
        return res.status(500).json({ error: `An internal server error occurred: ${error.message}` });
    }
};

//Get all Expenses Categories
const getAllExpensesCats = async (req, res) => {
    try {
        const expensesCat = await ExpensesCat.findAll();
        res.status(200).json(expensesCat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Expenses Category by id
const getExpensesCatById = async (req, res) => {
    try {
        const { id } = req.params;
        const expensesCat = await ExpensesCat.findByPk(id);
        res.status(200).json(expensesCat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a Expenses Category
const updateExpensesCat = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            expensesCatName,
            expensesCatType,
        } = req.body;

        const expensesCat = await ExpensesCat.findByPk(id);
        if (!expensesCat) {
            return res.status(404).json({ message: "Category not found" });
        }

        await expensesCat.update({
            expensesCatName,
            expensesCatType,
        });

        res.status(200).json(expensesCat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a Expenses Category
const deleteExpensesCat = async (req, res) => {
    try {
        const { id } = req.params;
        const expensesCat = await ExpensesCat.findByPk(id);
        if (!expensesCat) {
            return res.status(404).json({ message: "Expenses Category not found" });
        }
        await expensesCat.destroy();
        res.status(200).json({ message: "Expenses Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
module.exports = {
    createExpensesCategory,
    getAllExpensesCats,
    getExpensesCatById,
    updateExpensesCat,
    deleteExpensesCat,
};
