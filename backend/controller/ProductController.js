const Product = require("../model/Products");
const Category = require("../model/Category");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const productName = req.body.productName || 'product';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeProductName = productName.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeProductName}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('productImage');

// Create a new product
const createProduct = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const {
                productName,
                productCode,
                productUnit,
                productBuyingPrice,
                productSellingPrice,
                productDescription,
                productWarranty,
                productDiscount,
                categoryId
            } = req.body;

            // Validate required fields
            if (!productName || !productCode || !productUnit || !productBuyingPrice || !productSellingPrice) {
                return res.status(400).json({ error: "All fields are required." });
            }

            // Validate category
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Invalid category ID' });
            }

            // Check if product exists by productCode
            const existingProduct = await Product.findOne({ where: { productCode } });
            if (existingProduct) {
                return res.status(400).json({ error: "A Product with this code already exists." });
            }

            let productImage = null;
            if (req.file) {
                productImage = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
            }

            // Calculate profit based on buying and selling prices
            const productProfit = parseFloat(productSellingPrice) - parseFloat(productBuyingPrice);

            const newProduct = await Product.create({
                productName,
                productCode,
                productUnit,
                productBuyingPrice,
                productSellingPrice,
                productDiscount,
                productWarranty,
                productProfit,
                productDescription,
                productImage,
                productStatus: "In stock",
                category_categoryId: categoryId
            });

            const productWithCategory = await Product.findByPk(newProduct.productId, {
                include: [{
                    model: Category,
                    as: 'category'
                }]
            });

            res.status(201).json(productWithCategory);
        } catch (error) {
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    });
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{ model: Category, as: 'category' }]
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

// Get product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id, {
            include: [{ model: Category, as: 'category' }]
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getProductByName = async (req, res) => {
    try {
        const { name } = req.params;

        const product = await Product.findOne({
            where: { productName: name }
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        } product
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a product
const updateProduct = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const { id } = req.params;
            const {
                productName,
                productCode,
                productUnit,
                productDiscount,
                productBuyingPrice,
                productSellingPrice,
                productWarranty,
                productEmi,
                productStatus,
                categoryId
            } = req.body;

            // Validate category
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    return res.status(400).json({ message: 'Invalid category ID' });
                }
            }

            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            let productImage = product.productImage;
            if (req.file) {
                const oldImagePath = productImage
                    ? path.join(__dirname, '..', 'uploads', 'products', path.basename(productImage))
                    : null;

                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                productImage = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
            }

            const productProfit = parseFloat(productSellingPrice) - parseFloat(productBuyingPrice);

            await product.update({
                productName,
                productCode,
                productUnit,
                productDiscount,
                productBuyingPrice,
                productSellingPrice,
                productWarranty,
                productProfit,
                productEmi,
                productStatus,
                category_categoryId: categoryId,
                productImage
            });

            const updatedProduct = await Product.findByPk(id, {
                include: [{ model: Category, as: 'category' }]
            });

            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json({ error: `An error occurred: ${error.message}` });
        }
    });
};

// Delete a product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productImagePath = product.productImage
            ? path.join(__dirname, '..', 'uploads', 'products', path.basename(product.productImage))
            : null;

        if (productImagePath && fs.existsSync(productImagePath)) {
            fs.unlinkSync(productImagePath);
        }

        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: `An error occurred: ${error.message}` });
    }
};

const getProductByCodeOrName = async (req, res) => {
    try {
        const { value } = req.params;
        const product = await Product.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { productCode: value },
                    { productName: value }
                ]
            }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: error.message });
    }
};


const getProductSuggestions = async (req, res) => {
    try {
        const { query } = req.query;

        // Ensure query is at least 2 characters long
        if (!query || query.length < 2) {
            return res.status(400).json({ message: 'Query must be at least 2 characters long' });
        }

        // Fetch products matching the query by productName or productCode
        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { productName: { [Op.like]: `%${query}%` } },
                ]
            },
            attributes: ['productName'],
            limit: 10
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching product suggestions:', error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    getProductByName,
    updateProduct,
    deleteProduct,
    getProductByCodeOrName,
    getProductSuggestions
};
