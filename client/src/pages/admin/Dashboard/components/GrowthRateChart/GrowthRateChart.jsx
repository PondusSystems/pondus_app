import { useEffect, useRef } from 'react';
import './GrowthRateChart.css';
import Chart from 'chart.js/auto';

const GrowthRateChart = () => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext('2d');

        // Create the gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height); // Adjust gradient based on canvas width
        gradient.addColorStop(0, 'rgba(83, 253, 202, 1)'); // More color on the left
        gradient.addColorStop(1, 'rgba(83, 253, 202, 0.1)'); // More color on the left
        // gradient.addColorStop(1, 'rgba(255, 255, 255, 1)');   // Less color on the right    

        const growthRateChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Growth Rate',
                        data: [20, 30, 35, 30, 40, 50, 60, 53, 57, 60, 65, 72], // Replace with your data
                        borderColor: '#53FDCA',
                        borderWidth: '3.5',
                        backgroundColor: gradient, // Use the gradient as background color
                        fill: true,
                        tension: 0.4, // Smooth curve
                        pointRadius: 0,
                        pointHoverRadius: 0,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: -8,
                        bottom: -8,
                        right: 0
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false, // Disable tooltips
                    },
                    title: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false, // Hide horizontal grid lines
                            drawBorder: false,
                        },
                        border: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            display: false
                        },
                        grid: {
                            display: false, // Hide vertical grid lines
                            drawBorder: false,
                        },
                        border: {
                            display: false
                        }
                    },
                },
            },
        });

        // Cleanup function to destroy chart instance
        return () => {
            growthRateChart.destroy();
        };
    }, []);

    return (
        <div className='growth-rate-chart'>
            <div className='chart-header'>
                <div className='chart-title'>Growth Rate</div>
                <div className='chart-percentage'>33%</div>
            </div>
            <div className='growth-rate-chart-container'>
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};

export default GrowthRateChart;
