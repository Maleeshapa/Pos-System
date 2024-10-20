const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Invoice = require('./Invoice')
const Product = require("./Products");
const Stock = require("./Stock");

const InvoiceProduct = sequelize.define(
    "InvoiceProduct",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productId: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: "productId",
            },
            allowNull: false,
        },
        stockId: {
            type: DataTypes.INTEGER,
            references: {
                model: Stock,
                key: "stockId",
            },
            allowNull: false,
        },
        invoiceId: {
            type: DataTypes.INTEGER,
            references: {
                model: Invoice,
                key: "invoiceId",
            },
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        invoiceQty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "invoiceproduct",
        timestamps: false,
    }
);
InvoiceProduct.belongsTo(Product, {
    foreignKey: "productId",
    as: "product",
});
InvoiceProduct.belongsTo(Stock, {
    foreignKey: "stockId",
    as: "stock",
});
InvoiceProduct.belongsTo(Invoice, {
    foreignKey: "invoiceId",
    as: "invioce", // This is the problem
});

module.exports = InvoiceProduct;
