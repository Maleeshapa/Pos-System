import React, { useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CardFour = ({ dataValues = [], labels = [] }) => {

    const chartRef = useRef(null);
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 0.5)`;
    };

    const getRandomBorderColor = () => {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        return `rgba(${r}, ${g}, ${b}, 1)`;
    };

    useEffect(() => {
        if (dataValues.length === 0 || labels.length === 0) {
            return;
        }

        const backgroundColors = dataValues.map(() => getRandomColor());
        const borderColors = dataValues.map(() => getRandomBorderColor());

        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Stock Distribution',
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1,
                },
            ],
        };

        const config = {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Most Selling Products',
                    },
                },
            },
        };

        const myDoughnutChart = new window.Chart(chartRef.current, config);

        return () => {
            myDoughnutChart.destroy();
        };
    }, [dataValues, labels]);

    return (
        <div className="card bg-light mb-3 rounded-lg shadow-md relative me-3" style={{ height: '400px' }}>
            <div className="card-header">Top Selling Products In this Month</div>
            <div className="card-body">
                <div style={{ position: 'relative', height: '300px', width: '100%' }}>
                    <canvas ref={chartRef}></canvas>
                </div>
            </div>
        </div>
    );
};

export default CardFour;
