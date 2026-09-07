import React, { useState } from "react";

function ChartControls({
  chartType,
  setChartType,
  activeRange,
  setActiveRange,
  selectedCoins,
  toggleCoin,
}) {
  const [isCryptoOpen, setIsCryptoOpen] = useState(false);

  const ranges = ["1D", "1W", "1M", "6M", "1Y"];

  const coins = [
    "Bitcoin",
    "Ethereum",
    "Tether",
    "XRP",
    "Binance",
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* DATE RANGE */}
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

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2">
          {/* CRYPTO DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCryptoOpen((open) => !open)}
              className="flex h-[32px] min-w-[170px] items-center justify-between rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700"
            >
              <span className="truncate">
                {selectedCoins.length === 1
                  ? selectedCoins[0]
                  : `${selectedCoins.length} Cryptocurrencies`}
              </span>

              <span className="ml-2 text-[10px] text-gray-500">
                {isCryptoOpen ? "▲" : "▼"}
              </span>
            </button>

            {isCryptoOpen && (
              <div className="absolute right-0 top-[38px] z-50 w-[220px] rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                {coins.map((coin) => {
                  const selected = selectedCoins.includes(coin);

                  return (
                    <label
                      key={coin}
                      className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCoin(coin)}
                        className="h-4 w-4"
                      />

                      <span className="text-xs font-medium text-gray-700">
                        {coin}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* CHART TYPE */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="h-[32px] rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      {/* SELECTED COINS */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-gray-400">
          Selected:
        </span>

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
  );
}

export default ChartControls;
