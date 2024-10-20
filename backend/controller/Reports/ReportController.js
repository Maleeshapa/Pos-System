const { Op } = require("sequelize");
const Invoice = require("../../model/Invoice");
const Product = require("../../model/Products");
const User = require("../../model/User");
const sequelize = require("sequelize");

async function getReports(req, res) {
  try {
    const report = {
      lifetimeRevenue: await lifetimeRevenue(),
      lifetimeSales: await lifetimeSales(),

      revenueToday: await revenueToday(),
      salesToday: await salesToday(),

      revenueYesterday: await revenueYesterday(),
      salesYesterday: await salesYesterday(),

      revenueWeek: await revenueWeek(),
      salesWeek: await salesWeek(),

      revenueLastMonth: await revenueLastMonth(),
      salesLastMonth: await salesLastMonth(),

      revenueMonth: await revenueMonth(),
      salesMonth: await salesMonth(),

      // dailyRevenue: await dailyRevenue(),
      // dailySales: await dailySales(),

      // dailyRevenueLast30Days: await dailyRevenueLast30Days(),
      // dailySalesLast30Days: await dailySalesLast30Days(),

      mostSellingItemsWeek: await mostSellingItemsWeek(),
      mostSellingItemsMonth: await mostSellingItemsMonth(),

      monthlyRevenue: await monthlyRevenue(),
      monthlySales: await monthlySales(),
    };

    res.json({ message_type: "success", message: report });
  } catch (error) {
    console.error("Error while fetching reports:", error);
    res.status(500).json({ message_type: "error", message: error.message });
  }
}

// Lifetime Revenue
async function lifetimeRevenue() {
  const result = await Invoice.sum('totalAmount');
  return result || 0;
}

// Lifetime Sales
async function lifetimeSales() {
  const result = await Invoice.count();
  return result || 0;
}

// Today's Revenue
async function revenueToday() {
  const today = new Date();
  const result = await Invoice.sum('totalAmount', {
    where: {
      invoiceDate: {
        [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    },
  });
  return result || 0;
}

// Today's Sales
async function salesToday() {
  const today = new Date();
  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        [Op.lt]: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      },
    },
  });
  return result || 0;
}

// Yesterday's Revenue
async function revenueYesterday() {
  const today = new Date();
  const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const result = await Invoice.sum('totalAmount', {
    where: {
      invoiceDate: {
        [Op.gte]: yesterdayStart,
        [Op.lt]: yesterdayEnd,
      },
    },
  });

  return result || 0;
}

// Yesterday's Sales
async function salesYesterday() {
  const today = new Date();
  const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
  const yesterdayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: yesterdayStart,
        [Op.lt]: yesterdayEnd,
      },
    },
  });

  return result || 0;
}

// Weekly Revenue
async function revenueWeek() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const result = await Invoice.sum('totalAmount', {
    where: {
      invoiceDate: {
        [Op.gte]: last7Days,
        [Op.lt]: today,
      },
    },
  });
  return result || 0;
}

// Weekly Sales
async function salesWeek() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: last7Days,
        [Op.lt]: today,
      },
    },
  });
  return result || 0;
}

// Monthly Revenue
async function revenueMonth() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const result = await Invoice.sum('totalAmount', {
    where: {
      invoiceDate: {
        [Op.gte]: last30Days,
        [Op.lt]: today,
      },
    },
  });
  return result || 0;
}

// Monthly Sales
async function salesMonth() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: last30Days,
        [Op.lt]: today,
      },
    },
  });
  return result || 0;
}

// Last Month's Revenue
async function revenueLastMonth() {
  const today = new Date();
  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // The last day of the previous month

  const result = await Invoice.sum('totalAmount', {
    where: {
      invoiceDate: {
        [Op.gte]: startOfLastMonth,
        [Op.lt]: startOfCurrentMonth,
      },
    },
  });

  return result || 0;
}

// Last Month's Sales
async function salesLastMonth() {
  const today = new Date();
  const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

  const result = await Invoice.count({
    where: {
      invoiceDate: {
        [Op.gte]: startOfLastMonth,
        [Op.lt]: startOfCurrentMonth,
      },
    },
  });

  return result || 0;
}

// Daily Revenue for the Last 7 Days
async function dailyRevenue() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const result = [];

  for (let i = 0; i <= 6; i++) {
    const day = new Date(last7Days.getTime() + i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const revenue = await Invoice.sum('totalAmount', {
      where: {
        invoiceDate: {
          [Op.gte]: dayStart,
          [Op.lt]: dayEnd,
        },
      },
    });

    result.push({
      date: dayStart.toISOString().split('T')[0],
      revenue: revenue || 0,
    });
  }

  return result;
}

// Daily Sales for the Last 7 Days
async function dailySales() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);
  const result = [];

  for (let i = 0; i <= 6; i++) {
    const day = new Date(last7Days.getTime() + i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const sales = await Invoice.count({
      where: {
        invoiceDate: {
          [Op.gte]: dayStart,
          [Op.lt]: dayEnd,
        },
      },
    });

    result.push({
      date: dayStart.toISOString().split('T')[0],
      sales: sales || 0,
    });
  }

  return result;
}

// Daily Revenue for the Last 30 Days
async function dailyRevenueLast30Days() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  const result = [];

  for (let i = 0; i <= 29; i++) {
    const day = new Date(last30Days.getTime() + i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const revenue = await Invoice.sum('totalAmount', {
      where: {
        invoiceDate: {
          [Op.gte]: dayStart,
          [Op.lt]: dayEnd,
        },
      },
    });

    result.push({
      date: dayStart.toISOString().split('T')[0],
      revenue: revenue || 0,
    });
  }

  return result;
}

// Daily Sales for the Last 30 Days
async function dailySalesLast30Days() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);
  const result = [];

  for (let i = 0; i <= 29; i++) {
    const day = new Date(last30Days.getTime() + i * 24 * 60 * 60 * 1000);
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    const sales = await Invoice.count({
      where: {
        invoiceDate: {
          [Op.gte]: dayStart,
          [Op.lt]: dayEnd,
        },
      },
    });

    result.push({
      date: dayStart.toISOString().split('T')[0],
      sales: sales || 0,
    });
  }

  return result;
}

// Month-wise Revenue for the Last 12 Months
async function monthlyRevenue() {
  const today = new Date();
  const result = [];

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

    const revenue = await Invoice.sum('totalAmount', {
      where: {
        invoiceDate: {
          [Op.gte]: monthStart,
          [Op.lt]: monthEnd,
        },
      },
    });

    result.push({
      month: monthStart.toLocaleString('default', { month: 'long' }),
      year: monthStart.getFullYear(),
      revenue: revenue || 0,
    });
  }

  return result.reverse();
}

// Month-wise Sales for the Last 12 Months
async function monthlySales() {
  const today = new Date();
  const result = [];

  for (let i = 0; i < 12; i++) {
    const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

    const sales = await Invoice.count({
      where: {
        invoiceDate: {
          [Op.gte]: monthStart,
          [Op.lt]: monthEnd,
        },
      },
    });

    result.push({
      month: monthStart.toLocaleString('default', { month: 'long' }),
      year: monthStart.getFullYear(),
      sales: sales || 0,
    });
  }

  return result.reverse();
}

// Most Selling Items for the Week
async function mostSellingItemsWeek() {
  const today = new Date();
  const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const result = await Invoice.findAll({
    attributes: [
      [sequelize.col('productName'), 'productName'],
      [sequelize.fn('SUM', sequelize.col('invoiceQty')), 'totalQuantity']
    ],
    include: [{
      model: Product,
      as: 'product',
      attributes: []
    }],
    where: {
      invoiceDate: {
        [Op.gte]: last7Days,
        [Op.lt]: today,
      },
    },
    group: ['productId'],
    order: [[sequelize.fn('SUM', sequelize.col('invoiceQty')), 'DESC']],
    limit: 5,
    raw: true
  });

  return result;
}

// Most Selling Items for the Month
async function mostSellingItemsMonth() {
  const today = new Date();
  const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const result = await Invoice.findAll({
    attributes: [
      [sequelize.col('productName'), 'productName'],
      [sequelize.fn('SUM', sequelize.col('invoiceQty')), 'totalQuantity']
    ],
    include: [{
      model: Product,
      as: 'product',
      attributes: []
    }],
    where: {
      invoiceDate: {
        [Op.gte]: last30Days,
        [Op.lt]: today,
      },
    },
    group: ['productId'],
    order: [[sequelize.fn('SUM', sequelize.col('invoiceQty')), 'DESC']],
    limit: 5,
    raw: true
  });

  return result;
}
module.exports = {
  getReports,
};
