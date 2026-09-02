import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function PriceChart({ chartType }) {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Bitcoin",
        data: [100, 400, 800, 600, 1200, 1700],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
      },
      {
        label: "Ethereum",
        data: [150, 300, 500, 750, 1000, 2000],
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <div className="h-[400px]">
      {chartType === "line" ? <Line data={data} /> : <Bar data={data} />}
    </div>
  );
}

export default PriceChart;
