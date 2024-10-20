const { Op, Sequelize } = require("sequelize");
const sequelize = require("../../dbConfig");
const Stock = require("../../model/Stock");
const Product = require("../../model/Products");

async function getStockReports(req, res) {
    try {
        const report = await stockReport();
        res.json({ message_type: "success", message: report });
    } catch (error) {
        console.error("Error while fetching stock reports:", error);
        res.status(500).json({ message_type: "error", message: error.message });
    }
}

// Current Stock Report
async function stockReport() {
    const result = await Stock.findAll({
        attributes: [
            'products_productId',
            [sequelize.fn('SUM', sequelize.col('stockQty')), 'totalQty']
        ],
        include: [{
            model: Product,
            as: 'product',
            attributes: ['productName']
        }],
        group: ['products_productId', 'product.productName'],
        raw: true
    });

    return result;
}

module.exports = {
    getStockReports,
};