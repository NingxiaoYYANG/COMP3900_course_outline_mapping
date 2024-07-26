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

  const taxonomyOrder = ['Remember', 'Understand', 'Apply', 'Analyse', 'Evaluate', 'Create'];
  // Convert data object to array and sort it in descending order
  const sortedData = taxonomyOrder.map(level => [level, data[level] || 0]);
  
  // Extract sorted labels and values
  const labels = sortedData.map(([key]) => key);
  const values = sortedData.map(([, value]) => value);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: 'rgba(55, 39, 104, 0.2)',
        borderColor: 'rgba(55, 39, 104, 1)',
        borderWidth: 1,
        label: false
      }
    ]
  };

  const options = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: false, // Allow the chart to stretch to the container's aspect ratio
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

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
