import { useState } from "react";
import PriceChart from "./PriceChart";

function ChartSection() {
  const [chartType, setChartType] = useState("line");
  const [activeRange, setActiveRange] = useState("1W");

  const [selectedCoins, setSelectedCoins] = useState(["Ethereum"]);
  const [showCoinDropdown, setShowCoinDropdown] = useState(false);
  const [coinSearch, setCoinSearch] = useState("");

  const coins = [
    "Bitcoin",
    "Ethereum",
    "Tether",
    "XRP",
    "Binance",
  ];

  const ranges = ["1D", "1W", "1M", "6M", "1Y"];

  const filteredCoins = coins.filter((coin) =>
    coin.toLowerCase().includes(coinSearch.toLowerCase())
  );

  const toggleCoin = (coin) => {
    setSelectedCoins((current) => {
      if (current.includes(coin)) {
        // Don't allow all coins to be removed
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
      {/* Top controls */}
      <div className="mb-4 flex flex-col gap-3">
        {/* First row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Time range */}
          <div className="flex flex-wrap gap-1.5">
            {ranges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setActiveRange(range)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                  activeRange === range
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Coin selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setShowCoinDropdown((current) => !current)
                }
                className="flex min-w-[160px] items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700"
              >
                <span>
                  {selectedCoins.length === 1
                    ? selectedCoins[0]
                    : `${selectedCoins.length} coins selected`}
                </span>

                <span className="ml-3 text-gray-400">
                  {showCoinDropdown ? "▲" : "▼"}
                </span>
              </button>

              {showCoinDropdown && (
                <div className="absolute right-0 z-20 mt-1 w-[210px] rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                  {/* Search */}
                  <input
                    type="text"
                    value={coinSearch}
                    onChange={(e) => setCoinSearch(e.target.value)}
                    placeholder="Search coin..."
                    className="mb-2 w-full rounded-md border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-blue-400"
                  />

                  {/* Coin list */}
                  <div className="max-h-[180px] overflow-y-auto">
                    {filteredCoins.map((coin) => (
                      <label
                        key={coin}
                        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-xs hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCoins.includes(coin)}
                          onChange={() => toggleCoin(coin)}
                          className="h-3.5 w-3.5 rounded"
                        />

                        <span>{coin}</span>
                      </label>
                    ))}

                    {filteredCoins.length === 0 && (
                      <p className="px-2 py-2 text-xs text-gray-400">
                        No coin found
                      </p>
                    )}
                  </div>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => setShowCoinDropdown(false)}
                    className="mt-2 w-full rounded-md bg-gray-100 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Chart type */}
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none"
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="bar-chart-horizontal">
                Horizontal Bar
              </option>
            </select>
          </div>
        </div>

        {/* Selected coins */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-400">Selected:</span>

          {selectedCoins.map((coin) => (
            <span
              key={coin}
              className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-600"
            >
              {coin}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full">
        <PriceChart
          chartType={chartType}
          selectedCoins={selectedCoins}
          activeRange={activeRange}
        />
      </div>
    </div>
  );
}

export default ChartSection;
