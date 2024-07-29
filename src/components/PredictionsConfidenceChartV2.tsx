import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PredictionsConfidenceChartProps {
  data: { label: string; confidence: number }[];
}

const PredictionsConfidenceChartV2: React.FC<
  PredictionsConfidenceChartProps
> = ({ data }) => {
  const chartOptions = {
    responsive: true,
    //indexAxis: "y" as const, // Make the chart horizontal
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Predictions Confidence Level",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        offset: true,
        padding: 10, // Adjust the space between the chart and the edge of the canvas
        grid: {
          display: false, // Hide the y-axis grid lines
        },
      },
      y: {
        barThickness: 2, // Adjust the bar width
        offset: true,
      },
    },
  };

  const chartData = {
    labels: data.map((item) => item.label),
    datasets: [
      {
        label: "Confidence Level",
        data: data.map((item) => item.confidence),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        barThickness: 20, // Adjust the bar width
        maxBarThickness: 20, // Adjust the bar width
        categoryPercentage: 0.1, // Adjust the space between bars
        barPercentage: 0.1, // Adjust the space between bars
        borderRadius: 5, // Add rounded corners
      },
    ],
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default PredictionsConfidenceChartV2;
