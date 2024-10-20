const StockHistory = require("../model/StockHistory");
const Product = require("../model/Products");
const Stock = require("../model/Stock");

const getAllStockHistory = async (req, res) => {
    try {
        const stockHistory = await StockHistory.findAll({
            include: [
                { model: Stock, as: 'stock' },
                { model: Product, as: 'product' },
            ],
        });
        res.status(200).json(stockHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getAllStockHistory,
}