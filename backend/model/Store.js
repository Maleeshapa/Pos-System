const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Store = sequelize.define(
    "Store",
    {
        storeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        storeName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        storeAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        storeStatus: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "store",
        timestamps: false,
    }
);

module.exports = Store;