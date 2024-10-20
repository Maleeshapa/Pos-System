import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Use Bootstrap for layout

//generate random color
const getRandomColor = () => {
    const r = Math.floor(Math.random() * 100);
    const g = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    const a = Math.random().toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const CardThree = ({ stockSize, labels }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        //random color for each bar
        const backgroundColors = stockSize.map(() => getRandomColor());
        const borderColors = stockSize.map(() => getRandomColor());

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Stock',
                    data: stockSize,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                },
            ],
        };

        const config = {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        color: getRandomColor(),
                    },
                },
            },
        };

        const myBarChart = new window.Chart(chartRef.current, config);

        return () => {
            myBarChart.destroy();
        };
    }, [stockSize, labels]);

    return (
        <div className="bg-white mb-3" style={{ height: '400px' }}>
            <div className="card-header">Current Stock Bar Chart</div>
            <div className="card-body">
                <div style={{ position: 'relative', height: '400px', width: '100%' }}>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default CardThree;
