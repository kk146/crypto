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
import { useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function ChartSection() {
  const [chartType, setChartType] = useState("line");
  const [activeRange, setActiveRange] = useState("1W");

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Ethereum",
        data: [50, 80, 400, 150, 1000, 5000],
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.4,
      },
      {
        label: "Bitcoin",
        data: [0, 300, 500, 700, 2500, 4500],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  const ranges = ["1D", "1W", "1M", "6M", "1Y"];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Top Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeRange === range
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <select className="border rounded-lg px-4 py-2">
            <option>Bitcoin</option>
            <option>Ethereum</option>
            <option>Tether</option>
            <option>BNB</option>
          </select>

          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[400px]">
        {chartType === "line" ? (
          <Line data={data} options={options} />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}

export default ChartSection;
