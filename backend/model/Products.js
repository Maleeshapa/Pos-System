const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Category = require("./Category");

const Product = sequelize.define(
  "Product",
  {
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDiscount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    productUnit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productBuyingPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productSellingPrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productWarranty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productProfit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    productEmi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    productStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "In stock",
    },
    category_categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "category",
        key: "categoryId",
      },
    },
  },
  {
    tableName: "products",
    timestamps: false,
  }
);

Product.belongsTo(Category, {
  foreignKey: "category_categoryId",
  as: "category",
});


module.exports = Product;
