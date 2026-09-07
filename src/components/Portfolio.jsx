import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const portfolioValues = [375, 375, 250];
const portfolioLabels = [
  "Tether",
  "Luna",
  "Ethereum",
];

const valueLabelPlugin = {
  id: "valueLabelPlugin",

  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    const meta = chart.getDatasetMeta(0);
    const values = chart.data.datasets[0].data;

    ctx.save();

    meta.data.forEach((arc, index) => {
      const position = arc.tooltipPosition();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(
        `$${values[index]}`,
        position.x,
        position.y
      );
    });

    ctx.restore();
  },
};

function Portfolio() {
  const totalValue = portfolioValues.reduce(
    (sum, value) => sum + value,
    0
  );

  const data = {
    labels: portfolioLabels,

    datasets: [
      {
        data: portfolioValues,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "right",

        labels: {
          boxWidth: 8,
          boxHeight: 8,
          padding: 10,
          font: {
            size: 11,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            return `$${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-[260px] rounded-xl bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-800">
          Portfolio
        </h2>

        <span className="text-[11px] text-gray-400">
          Total value{" "}
          <span className="font-semibold text-gray-700">
            ${totalValue}
          </span>
        </span>
      </div>

      <div className="h-[205px] w-full">
        <Pie
          data={data}
          options={options}
          plugins={[valueLabelPlugin]}
        />
      </div>
    </div>
  );
}

export default Portfolio;
