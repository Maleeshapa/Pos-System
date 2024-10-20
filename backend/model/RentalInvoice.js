const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Customer = require("./Customers");
const Category = require("./Category");
const Product = require("./Products");

const RentalInvoice = sequelize.define(
    "RentalInvoice",
    {
        rentalInvoiceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        rentalInvoiceDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        rentalInvoiceTotalAmount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rentalInvoiceAdvancePayment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rentalInvoiceNote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customer_cusId: {
            type: DataTypes.INTEGER,
            references: {
                model: "customer",
                key: "cusId",
            },
            allowNull: false,
        },
        products_productId: {
            type: DataTypes.INTEGER,
            references: {
                model: "product",
                key: "productId",
            },
            allowNull: false,
        },
    },
    {
        tableName: "rentalInvoice",
        timestamps: false,
    }
);

RentalInvoice.belongsTo(Customer, {
    foreignKey: "customer_cusId",
    as: "customer",
});
RentalInvoice.belongsTo(Product, {
    foreignKey: "products_productId",
    as: "product",
});
module.exports = RentalInvoice;