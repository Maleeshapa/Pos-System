const { DataTypes } = require("sequelize");
const sequelize = require("../dbConfig");
const ExpensesCat = require("./ExpensesCat");
const User = require("./User");

const Expenses = sequelize.define(
    "Expenses",
    {
        expensesId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        expensesRef: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expensesNote: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expensesAmount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expensesDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        expensesImage: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expensesCat_expensesCatId: {
            type: DataTypes.INTEGER,
            references: {
                model: "expensesCat",
                key: "expensesCatId",
            },
        },
        user_userId: {
            type: DataTypes.INTEGER,
            references: {
                model: "user",
                key: "userId",
            },
        },
    },
    {
        tableName: "expenses",
        timestamps: false,
    }
);
Expenses.belongsTo(ExpensesCat, {
    foreignKey: 'expensesCat_expensesCatId',
    as: 'expensesCat'
});
Expenses.belongsTo(User, {
    foreignKey: 'user_userId',
    as: 'user'
});

module.exports = Expenses;