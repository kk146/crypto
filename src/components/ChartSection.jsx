import { useState } from "react";
import ChartControls from "./ChartControls";
import PriceChart from "./PriceChart";

function ChartSection({ currency = "usd" }) {
  const [chartType, setChartType] = useState("line");

  const [activeRange, setActiveRange] = useState("1W");

  const [selectedCoins, setSelectedCoins] = useState([
    "Ethereum",
  ]);

  /*
   * Handle cryptocurrency selection.
   *
   * Rules:
   * - At least 1 coin must remain selected.
   * - Maximum 2 coins can be selected.
   */
  const toggleCoin = (coin) => {
    setSelectedCoins((currentCoins) => {
      // If coin is already selected
      if (currentCoins.includes(coin)) {
        // Don't allow all coins to be removed
        if (currentCoins.length === 1) {
          return currentCoins;
        }

        // Remove the coin
        return currentCoins.filter(
          (item) => item !== coin
        );
      }

      // If already 2 coins are selected,
      // replace the first one with the new coin.
      if (currentCoins.length >= 2) {
        return [currentCoins[1], coin];
      }

      // Add new coin
      return [...currentCoins, coin];
    });
  };

  return (
    <div className="w-full rounded-xl bg-white p-4 shadow-sm">
      {/* CONTROLS */}
      <ChartControls
        chartType={chartType}
        setChartType={setChartType}
        activeRange={activeRange}
        setActiveRange={setActiveRange}
        selectedCoins={selectedCoins}
        toggleCoin={toggleCoin}
      />

      {/* CHART */}
      <div className="relative z-0 mt-4">
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
