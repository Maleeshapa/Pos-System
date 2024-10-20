import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const getRandomColor = () => {
  const r = Math.floor(Math.random() * 100);
  const g = Math.floor(Math.random() * 100);
  const b = Math.floor(Math.random() * 100);
  const a = (Math.random()).toFixed(2);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

function CardTwo({ monthlyRevenue, monthlySales }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (monthlyRevenue && monthlyRevenue.length > 0 && chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const sortedRevenueData = [...monthlyRevenue].sort((a, b) => {
        return new Date(a.year, getMonthIndex(a.month)) - new Date(b.year, getMonthIndex(b.month));
      });

      const sortedSalesData = monthlySales
        ? [...monthlySales].sort((a, b) => {
          return new Date(a.year, getMonthIndex(a.month)) - new Date(b.year, getMonthIndex(b.month));
        })
        : [];

      const labels = sortedRevenueData.map(item => `${item.month} ${item.year}`);

      // Get random colors for datasets
      const revenueColor = getRandomColor();
      const salesColor = getRandomColor();

      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Monthly Revenue',
              data: sortedRevenueData.map(item => item.revenue),
              fill: false,
              borderColor: revenueColor,
              backgroundColor: revenueColor,
              tension: 0.1,
            },
            {
              label: 'Monthly Sales',
              data: sortedSalesData.map(item => item.sales),
              fill: false,
              borderColor: salesColor,
              backgroundColor: salesColor,
              tension: 0.1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: false,
                text: 'Revenue / Sales',
              },
            },
            x: {
              title: {
                display: false,
                text: 'Month',
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [monthlyRevenue, monthlySales]);

  const getMonthIndex = (monthName) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months.indexOf(monthName);
  };

  return (
    <div className="card h-100 me-3">
      <div className="card-header">Total Sales & Revenue Over Time</div>
      <div className="card-body" style={{ height: '300px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

export default CardTwo;
