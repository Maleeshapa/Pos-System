const Category = require("../model/Category");

// Create category
const createCategory = async (req, res) => {
    try {
        const {
            categoryName,
            categoryType
        } = req.body;

        // Check only for essential fields
        if (!categoryName) {
            return res.status(400).json({ error: "Category Name is required." });
        }

        // Check if category with the same name already exists
        const existingCategory = await Category.findOne({ where: { categoryName } });
        if (existingCategory) {
            return res
                .status(400)
                .json({ error: "A Category Name already exists." });
        }

        // Create the new category with categoryStatus defaulting to "In stock"
        const newCategory = await Category.create({
            categoryName,
            categoryType: categoryType || 'Default Type', // Optional, use default if not provided
            categoryStatus: "In stock" // You can change this if needed
        });

        res.status(201).json(newCategory);
    } catch (error) {
        // Error handling remains the same
        if (error.name === "SequelizeValidationError") {
            return res
                .status(400)
                .json({ error: "Validation error: Please check the provided data." });
        }

        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({
                error: "Duplicate field value: A Category name already exists.",
            });
        }

        res.status(400).json({ error: `An error occurred: ${error.message}` });
    }
};


// Get all category
const getAllCategories = async (req, res) => {
    try {
        const category = await Category.findAll();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            categoryName,
            categoryType,
            categoryStatus
        } = req.body;

        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Update only the fields that are provided
        await category.update({
            categoryName: categoryName !== undefined ? categoryName : category.categoryName, // Keep current if not provided
            categoryType: categoryType !== undefined ? categoryType : category.categoryType, // Keep current if not provided
            categoryStatus: categoryStatus !== undefined ? categoryStatus : category.categoryStatus // Keep current if not provided
        });

        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a category
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        await category.destroy();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCustomer,
}
