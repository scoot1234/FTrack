import { Pie } from "react-chartjs-2";
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
export default function Emptypiechart() {
  const data = {
    labels: ["Money Saved", "Money Spent"],
    datasets: [
      {
        data: [50, 50],
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
