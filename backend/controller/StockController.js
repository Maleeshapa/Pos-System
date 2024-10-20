const Stock = require("../model/Stock");
const Supplier = require("../model/Supplier");
const Product = require("../model/Products");
const Store = require("../model/Store");
const Category = require("../model/Category");
const StockHistory = require("../model/StockHistory");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Image upload setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'stock');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const stockName = req.body.stockName || 'bill';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);

        const safeStockName = stockName.replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `${safeStockName}_${timestamp}${ext}`);
    }
});

const upload = multer({ storage: storage }).single('billImage');

const createStock = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Image upload failed due to Multer error' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }

        try {
            const {
                stockName,
                stockDate,
                stockPrice,
                due,
                vat,
                total,
                stockQty,
                mfd,
                exp,
                cashAmount,
                chequeAmount,
                stockDescription,
                productId,
                supplierId,
                storeId,
                categoryId,
            } = req.body;

            // Validate required fields
            if (!stockName || !stockDate || !stockPrice || !productId || !supplierId || !storeId) {
                return res.status(400).json({ error: "All required fields must be filled." });
            }

            // Example: Validate mfd and exp only for specific categories (if needed)
            if (categoryId === 'specific-category-id') {
                if (!mfd || !exp) {
                    return res.status(400).json({ error: "MFD and EXP are required for this category." });
                }
            }

            // Rest of the validation and creation logic remains the same
            const supplier = await Supplier.findByPk(supplierId);
            if (!supplier) {
                return res.status(400).json({ error: 'Invalid supplier ID' });
            }

            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(400).json({ error: 'Invalid product ID' });
            }

            const store = await Store.findByPk(storeId);
            if (!store) {
                return res.status(400).json({ error: 'Invalid store ID' });
            }

            // Handle image upload
            let billImage = null;
            if (req.file) {
                billImage = `${req.protocol}://${req.get('host')}/uploads/stock/${req.file.filename}`;
            }

            // Set default values for optional fields
            const chequeAmountValue = chequeAmount === '' || chequeAmount === undefined ? null : parseFloat(chequeAmount);
            const cashAmountValue = cashAmount === '' || cashAmount === undefined ? null : parseFloat(cashAmount);

            // Create new stock
            const newStock = await Stock.create({
                stockName,
                stockDate,
                stockPrice,
                due,
                vat,
                total,
                stockQty,
                mfd: mfd || null,
                exp: exp || null,
                cashAmount: cashAmountValue,
                chequeAmount: chequeAmountValue,
                stockDescription,
                stockStatus: "In stock",
                billImage,
                products_productId: productId,
                supplier_supplierId: supplierId,
                store_storeId: storeId,
                category_categoryId: categoryId,
            });

            const stockDetails = await Stock.findByPk(newStock.stockId, {
                include: [
                    { model: Supplier, as: 'supplier' },
                    { model: Product, as: 'product' },
                    { model: Store, as: 'store' },
                    { model: Category, as: 'category' },
                ],
            });

            // Now create a stock history entry
            await StockHistory.create({
                stockHistoryQty: stockQty,
                stock_stockId: newStock.stockId,
                products_productId: productId
            });

            res.status(201).json(stockDetails);
        } catch (error) {
            return res.status(500).json({ error: `An internal error occurred: ${error.message}` });
        }
    });
};

// Get all stocks
const getAllStocks = async (req, res) => {
    try {
        const stocks = await Stock.findAll({
            include: [
                { model: Supplier, as: 'supplier' },
                { model: Product, as: 'product' },
                { model: Store, as: 'store' },
                { model: Category, as: 'category' },
            ],
        });
        res.status(200).json(stocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stock by ID
const getStockById = async (req, res) => {
    try {
        const { id } = req.params;
        const stock = await Stock.findByPk(id, {
            include: [
                { model: Supplier, as: 'supplier' },
                { model: Product, as: 'product' },
                { model: Store, as: 'store' },
                { model: Category, as: 'category' },
            ],
        });

        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStockIdUsingProductId = async (req, res) => {
    try {
        const { products_productId } = req.params;
        const stock = await Stock.findOne({ where: { products_productId } });
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }
        res.status(200).json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update stock
const updateStock = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ error: 'Multer error: Image upload failed' });
        } else if (err) {
            return res.status(500).json({ error: 'Unknown error: Image upload failed' });
        }
        try {
            const { id } = req.params;
            const {
                stockName,
                stockDate,
                stockPrice,
                due,
                vat,
                total,
                stockQty,
                mfd,
                exp,
                stockDescription,
                cashAmount,
                chequeAmount,
                stockStatus,
                productId,
                supplierId,
                storeId,
                categoryId,
            } = req.body;

            // Validate product
            if (productId) {
                const product = await Product.findByPk(productId);
                if (!product) {
                    return res.status(400).json({ message: 'Invalid product ID' });
                }
            }

            // Validate supplier
            if (supplierId) {
                const supplier = await Supplier.findByPk(supplierId);
                if (!supplier) {
                    return res.status(400).json({ message: 'Invalid supplier ID' });
                }
            }

            // Validate store
            if (storeId) {
                const store = await Store.findByPk(storeId);
                if (!store) {
                    return res.status(400).json({ message: 'Invalid store ID' });
                }
            }

            // Validate category
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    return res.status(400).json({ message: 'Invalid category ID' });
                }
            }

            // Find the stock
            const stock = await Stock.findByPk(id);
            if (!stock) {
                return res.status(404).json({ message: 'Stock not found' });
            }

            // Check if a new image is uploaded and delete the old one
            let billImage = stock.billImage;
            if (req.file) {
                // If an old image exists, delete it
                const oldImagePath = billImage
                    ? path.join(__dirname, '..', 'uploads', 'stock', path.basename(billImage))
                    : null;

                if (oldImagePath && fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }

                // Update the stock image with the new one
                billImage = `${req.protocol}://${req.get('host')}/uploads/stock/${req.file.filename}`;
            }


            await stock.update({
                stockName,
                stockDate,
                stockPrice,
                due,
                vat,
                total,
                stockQty,
                mfd,
                exp,
                stockDescription,
                cashAmount,
                chequeAmount,
                stockStatus,
                billImage,
                products_productId: productId,
                supplier_supplierId: supplierId,
                store_storeId: storeId,
                category_categoryId: categoryId,
            });


            if (stockQty && stockQty !== stock.stockQty) {
                await StockHistory.create({
                    stockHistoryQty: stockQty,
                    stock_stockId: stock.stockId,
                    products_productId: productId
                });
            }

            res.status(200).json(stock);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });
};

// Delete stock
const deleteStock = async (req, res) => {
    try {
        const { id } = req.params;
        const stock = await Stock.findByPk(id);
        if (!stock) {
            return res.status(404).json({ message: "Stock not found" });
        }

        // If the stock has an associated image, delete it from the file system
        if (stock.billImage) {
            const imagePath = path.join(__dirname, '..', 'uploads', 'stock', path.basename(stock.billImage));
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await stock.destroy();
        res.status(200).json({ message: "Stock deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createStock,
    getAllStocks,
    getStockById,
    updateStock,
    deleteStock,
    getStockIdUsingProductId
};
