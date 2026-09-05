import React from "react";
import { Pie } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  Tooltip,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

function Portfolio() {
  const data = {
    labels: ["Tether", "Luna", "Ethereum"],
    datasets: [
      {
        data: [250, 375, 375],
        backgroundColor: [
          "#3B82F6",
          "#F87171",
          "#55C7B0",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="w-full h-full rounded-lg bg-white px-5 py-3">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-gray-800">
          Portfolio
        </h2>

        <span className="text-[10px] text-gray-300">
          Total value{" "}
          <span className="font-bold text-gray-800">
            $1000
          </span>
        </span>
      </div>

      {/* Content */}
      <div className="mt-3 flex items-center">
        
        {/* Pie chart */}
        <div className="relative h-[110px] w-[110px] flex-shrink-0">
          <Pie data={data} options={options} />

          {/* Chart values */}
          <span className="absolute left-[18px] top-[31px] text-[9px] font-medium text-white">
            $250
          </span>

          <span className="absolute left-[17px] bottom-[25px] text-[9px] font-medium text-white">
            $375
          </span>

          <span className="absolute right-[13px] top-[47px] text-[9px] font-medium text-white">
            $375
          </span>
        </div>

        {/* Legend */}
        <div className="ml-4 flex flex-col gap-[7px]">
          
          <div className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#3B82F6]" />
            <span className="text-[10px] text-gray-600">
              Tether
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#F87171]" />
            <span className="text-[10px] text-gray-600">
              Luna
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-[7px] w-[7px] rounded-full bg-[#55C7B0]" />
            <span className="text-[10px] text-gray-600">
              Ethereum
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Portfolio;
