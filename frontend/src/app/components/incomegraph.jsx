"use client";
import api from "../api/localapi";
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

export default function IncomeGraph() {
  const [allowances, setAllowances] = useState([]);
  const [infoAllowance, setInfoAllowance] = useState([]);
  const [infoSave, setInfoSave] = useState([]);
  const [infoSpent, setInfoSpent] = useState([]);
  const tempinfoAllowance = [];
  const tempinfoSave = [];
  const tempinfoSpent = [];
  const dates = [
    "23 / 10 / 2024",
    "23 / 11 / 2024",
    "23 / 12 / 2024",
    "23 / 1 / 2025",
    "23 / 2 / 2025",
  ]; // info.created_at

  useEffect(() => {
    getAllowances();
  }, []);

  const getAllowances = () => {
    api
      .get("/api/allowance/")
      .then((res) => {
        const data = res.data;
        console.log("data:", data);

        // Ensure data is an array
        if (Array.isArray(data)) {
          setAllowances(data);
        } else {
          alert("Error: Data returned is not an array");
        }
      })
      .catch((error) => alert(error));
  };

  useEffect(() => {
    if (allowances.length > 0) {
      const sortedAllowances = allowances.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      const info = sortedAllowances.slice(0, 5);

      // Process each allowance data to populate the chart
      for (let i = 0; i < info.length; i++) {
        const allowance = parseFloat(info[i].allowance);
        const monthlySpent = parseFloat(info[i].monthlyspent);

        // Populate data if values are valid
        if (!isNaN(allowance) && !isNaN(monthlySpent)) {
          tempinfoAllowance.push(allowance);
          tempinfoSpent.push(monthlySpent);
          tempinfoSave.push(allowance - monthlySpent);
          // dates.push(new Date(info[i].created_at).toLocaleDateString());
        } else {
          // If invalid, push 0 values for safety
          tempinfoAllowance.push(0);
          tempinfoSpent.push(0);
          tempinfoSave.push(0);

          //dates.push("Invalid Date");
        }
      }

      setInfoAllowance(tempinfoAllowance.reverse());
      setInfoSpent(tempinfoSpent.reverse());
      setInfoSave(tempinfoSave.reverse());
    }
  }, [allowances]);

  const chartData = {
    labels: dates, // Dates should be populated here
    datasets: [
      {
        label: "Savings (Allowance - Spent)",
        data: infoSave, // Populate with savings datainfoSave
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
      {
        label: "Allowance",
        data: infoAllowance, // Populate with allowance data
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)", // Different color for this line
        tension: 0.1,
      },
      {
        label: "Monthly Spent",
        data: infoSpent, // Populate with spent data
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)", // Different color for this line
        tension: 0.1,
      },
    ],
  };

  // Chart.js options to customize axis and appearance
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount",
        },
        beginAtZero: true, // Start Y-axis from 0
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}
