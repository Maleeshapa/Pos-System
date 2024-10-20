const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Product = require("./Products");
const Stock = require("./Stock");

const StockHistory = sequelize.define(
    "StockHistory",
    {
        stockHistoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        stockHistoryQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        products_productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
            },
        },
        stock_stockId: {
            type: DataTypes.INTEGER,
            references: {
                model: Stock,
                key: "stockId",
            },
        },
    },
    {
        tableName: "stockHistory",
        timestamps: false,
    }
);
StockHistory.belongsTo(Product, {
    foreignKey: "products_productId",
    as: "product",
});
StockHistory.belongsTo(Stock, {
    foreignKey: 'stock_stockId',
    as: 'stock'
});
module.exports = StockHistory;