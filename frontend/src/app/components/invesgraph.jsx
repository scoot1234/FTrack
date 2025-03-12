"use client";
// Work in progress
import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Graph() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url =
      "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=IBM&apikey=XXX";

    // Fetch data from API using fetch API
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // Check if data is loaded and contains the time series
  if (data && data["Time Series (Daily)"]) {
    // Extract the first 5 entries
    const timeSeries = Object.entries(data["Time Series (Daily)"])
      .slice(0, 10)
      .reverse();

    // Prepare data for Chart.js
    const dates = timeSeries.map(([date]) => date);

    const closingPrices = timeSeries.map(([_, info]) =>
      parseFloat(info["4. close"])
    );

    // Chart.js data structure
    const chartData = {
      labels: dates,
      datasets: [
        {
          label: "IBM Stock Price (Close)",
          data: closingPrices,
          fill: false,
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
          options: {
            responsive: true, // Make chart responsive
            maintainAspectRatio: false, // Allow it to fill its container
          },
        },
      ],
    };

    return (
      <div className="w-full h-full">
        {/* Render the Line chart */}
        <Line data={chartData} />
      </div>
    );
  } else {
    return <h1>Daily Limit</h1>;
  }
}
