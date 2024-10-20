const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");

const Category = sequelize.define(
    "Category",
    {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryType: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "In stock"
        },
    },
    {
        tableName: "category",
        timestamps: false,
    }
);

module.exports = Category;
