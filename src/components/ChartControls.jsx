import React from "react";

function ChartControls({
  chartType,
  setChartType,
  activeRange,
  setActiveRange,
  selectedCoins,
  toggleCoin,
}) {
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
      {/* Top row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Time range buttons */}
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

        {/* Coin + chart controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Cryptocurrency selection */}
          <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1">
            {coins.map((coin) => {
              const selected = selectedCoins.includes(coin);

              return (
                <button
                  key={coin}
                  type="button"
                  onClick={() => toggleCoin(coin)}
                  className={`rounded px-2 py-1 text-[11px] font-medium transition ${
                    selected
                      ? "bg-blue-500 text-white"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {coin}
                </button>
              );
            })}
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
