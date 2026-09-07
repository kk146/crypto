import { useState } from "react";
import ChartControls from "./ChartControls";
import PriceChart from "./PriceChart";

function ChartSection({ currency = "usd" }) {
  const [chartType, setChartType] = useState("line");
  const [activeRange, setActiveRange] = useState("1W");

  const [selectedCoins, setSelectedCoins] = useState([
    "Ethereum",
  ]);

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm">
      <ChartControls
        chartType={chartType}
        setChartType={setChartType}
        activeRange={activeRange}
        setActiveRange={setActiveRange}
        selectedCoins={selectedCoins}
        setSelectedCoins={setSelectedCoins}
      />

      <div className="mt-4">
        <PriceChart
          chartType={chartType}
          selectedCoins={selectedCoins}
          activeRange={activeRange}
          currency={currency}
        />
      </div>
    </div>
  );
}

export default ChartSection;
