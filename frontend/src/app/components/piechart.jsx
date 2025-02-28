"use client";
import { Pie } from "react-chartjs-2";
import api from "../api/localapi";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale
);

export default function PieChart() {
  const [allowances, setAllowances] = useState([]);
  const infoArr = [];
  useEffect(() => {
    getAllowances();
  }, []);

  const getAllowances = () => {
    api
      .get("/api/allowance/")
      .then((res) => {
        const data = res.data;

        // Ensure data is an array
        if (Array.isArray(data)) {
          setAllowances(data.reverse());
          console.log(allowances);
        } else {
          alert("Error: Data returned is not an array");
        }
      })
      .catch((error) => alert(error));
  };
  const sortedAllowances = allowances.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const info = sortedAllowances.slice(0, 1);
  console.log(info);
  if (sortedAllowances.length > 0) {
    const info = sortedAllowances[0];
    infoArr.push(
      info.allowance - parseFloat(info.monthlyspent),
      parseFloat(info.monthlyspent)
    );
    console.log(infoArr);
  } else {
    console.log("No allowances available");
  }

  const data = {
    labels: ["Money Saved", "Money Spent"],
    datasets: [
      {
        data: infoArr,
        backgroundColor: ["#FF0000", "#0000FF", "#FFFF00", "#008000"],
        hoverBackgroundColor: ["#FF4C4C", "#4C4CFF", "#FFFF66", "#66B366"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div>
      <Pie data={data} options={options} />
    </div>
  );
}
