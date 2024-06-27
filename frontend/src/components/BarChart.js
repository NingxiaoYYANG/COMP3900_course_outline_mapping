// BarChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        data: Object.values(data),
        backgroundColor: 'rgba(171, 23, 82, 0.2)',
        borderColor: 'rgba(171, 23, 82, 1)',
        borderWidth: 1,
        label: false // Remove the label here
      }
    ]
  };

  const options = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: true, // Keep chart aspect ratio
    plugins: {
      legend: {
        display: false // Hide legend
      },
      title: {
        display: true,
        text: 'Bloom\'s Taxonomy Counts',
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          display: true // Ensure x-axis ticks are displayed
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          display: true // Ensure y-axis ticks are displayed
        }
      }
    }
  };

  return <div style={{ width: '700px', }}>
    <Bar data={chartData} options={options} />
  </div>;
};

export default BarChart;
