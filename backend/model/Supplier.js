const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Supplier = sequelize.define(
    "Supplier",
    {
        supplierId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        supplierName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        supplierAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supplierNic: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supplierEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supplierTP: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supplierSecondTP: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        supplierStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Active",
        },
    },
    {
        tableName: "supplier",
        timestamps: false,
    }
);

module.exports = Supplier;
