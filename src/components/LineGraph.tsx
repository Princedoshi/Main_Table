import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineGraphProps {
  data: { year: number; totalJobs: number; averageSalary: number }[];
}

const LineGraph: React.FC<LineGraphProps> = ({ data }) => {
  const years = data.map(item => item.year);
  const totalJobs = data.map(item => item.totalJobs);
  const averageSalary = data.map(item => item.averageSalary);

  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Total Jobs',
        data: totalJobs,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Average Salary (USD)',
        data: averageSalary,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />; 
};

export default LineGraph;
