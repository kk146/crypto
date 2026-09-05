import { useState } from "react";
import ChartControls from "./ChartControls";
import PriceChart from "./PriceChart";

function ChartSection({ currency = "usd" }) {
  const [chartType, setChartType] = useState("line");
  const [activeRange, setActiveRange] = useState("1W");

  // Default cryptocurrency
  const [selectedCoins, setSelectedCoins] = useState([
    "Ethereum",
  ]);

  const toggleCoin = (coin) => {
    setSelectedCoins((current) => {
      // Don't allow the user to remove the last coin
      if (current.includes(coin)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== coin);
      }

      return [...current, coin];
    });
  };

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm">
      {/* Chart controls */}
      <ChartControls
        chartType={chartType}
        setChartType={setChartType}
        activeRange={activeRange}
        setActiveRange={setActiveRange}
        selectedCoins={selectedCoins}
        toggleCoin={toggleCoin}
      />

      {/* Price chart */}
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
