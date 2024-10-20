const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Customer = sequelize.define(
    "Customer",
    {
        cusId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cusTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusPhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusNIC: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cusCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusJob: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusCompany: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusWorkPlaceTP: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusWorkPlaceAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cusPoints: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: '10',
        },
        cusStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Active",
        },
    },
    {
        tableName: "customer",
        timestamps: false,
    }
);

module.exports = Customer;
