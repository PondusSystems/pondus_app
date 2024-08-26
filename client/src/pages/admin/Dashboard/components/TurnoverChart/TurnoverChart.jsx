import { useEffect, useRef } from 'react';
import './TurnoverChart.css';
import Chart from 'chart.js/auto';

const TurnoverChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Create the gradient
    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0); // Adjust gradient based on canvas width
    gradient.addColorStop(0, 'rgba(83, 253, 202, 0.3)'); // More color on the left
    gradient.addColorStop(1, 'rgba(83, 253, 202, 0.1)');   // Less color on the right

    const turnoverChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Turnover',
            data: [40, 30, 50, 60, 70, 80, 90, 70, 60, 80, 90, 100], // Replace with your data
            borderColor: '#53FDCA',
            borderWidth: '3.5',
            backgroundColor: gradient, // Use the gradient as background color
            fill: true,
            tension: 0.4, // Smooth curve
            pointHoverBackgroundColor: '#00d1b2',
            pointHoverBorderColor: '#fff',
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        layout: {
          padding: {
            // right: -100
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || '';

                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += `${context.parsed.y} K`;
                }
                return label;
              },
            },
          },
          title: { // Add the title configuration here
            display: true,
            text: 'Turnover (K)',
            position: 'top',
            padding: {
              top: 10,
              bottom: 20
            },
            font: {
              size: 20,
              weight: 'bold'
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: false,
              text: 'Turnover (K)',
            },
            ticks: {
              stepSize: 20,
            },
            grid: {
              display: true, // Show horizontal grid lines
              drawBorder: false, // Optional: Remove border line on the y-axis
            },
          },
          x: {
            title: {
              display: false,
              text: 'Months',
            },
            grid: {
              display: false, // Hide vertical grid lines
              drawBorder: false, // Optional: Remove border line on the x-axis
            },
          },
        },
      },
    });

    // Cleanup function to destroy chart instance
    return () => {
      turnoverChart.destroy();
    };
  }, []);

  return (
    <div className='turnover-chart-container'>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default TurnoverChart;
