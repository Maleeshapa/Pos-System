const Invoice = require("../model/Invoice");
const Product = require("../model/Products");
const Stock = require("../model/Stock");
const InvoiceProduct = require('../model/InvoiceProduct')

const createInvoiceProduct = async (req, res) => {
    try {
      const invoiceProducts = req.body; // Expecting an array of products
  
      // Validate input
      if (!Array.isArray(invoiceProducts) || invoiceProducts.length === 0) {
        return res.status(400).json({ message: 'No products provided' });
      }
  
      for (const invoiceProduct of invoiceProducts) {
        const { productId, stockId, invoiceId, totalAmount, invoiceQty } = invoiceProduct;
  
        // Check if the product exists
        const product = await Product.findByPk(productId);
        if (!product) {
          return res.status(400).json({ message: `Invalid product ID: ${productId}` });
        }
  
        // Check if the stock exists
        const stock = await Stock.findByPk(stockId);
        if (!stock) {
          return res.status(400).json({ message: `Invalid stock ID: ${stockId}` });
        }
  
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            return res.status(400).json({ message: 'Invalid invoice ID' });
        }

        // Check if enough stock is available
        if (stock.stockQty < invoiceQty) {
          return res.status(400).json({ message: `Not enough stock available for ID: ${stockId}` });
        }
  
        // Update stock quantity
        const updatedStockQty = stock.stockQty - invoiceQty;
        await stock.update({ stockQty: updatedStockQty });
  
        // Create the invoice product
        await InvoiceProduct.create({
          productId,
          stockId,
          invoiceId,
          totalAmount,
          invoiceQty,
        });
      }
  
      // Respond with success
      res.status(201).json({
        message: 'Invoice products created successfully',
      });
  
    } catch (error) {
      console.error('Error creating invoice products:', error);
      res.status(500).json({
        message: 'Server error occurred while creating the invoice products',
        error: error.message,
      });
    }
  };
  
  module.exports = { createInvoiceProduct };