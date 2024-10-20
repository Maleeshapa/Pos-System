const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const Store = require("./Store")

const User = sequelize.define(
    "User",
    {
        userId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userFullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userPassword: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userNIC: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userTP: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userSecondTP: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        userStatus: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: "Active",
        },
        store_storeId: {
            type: DataTypes.INTEGER,
            references: {
                model: "store",
                key: "storeId",
            },
            allowNull: false,
        },
        is_hidden: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0, 
        },
    },
    {
        tableName: "user",
        timestamps: false,
    }
);
User.belongsTo(Store, {
    foreignKey: 'store_storeId',
    as: 'store',
});
module.exports = User;
