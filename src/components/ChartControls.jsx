import React, { useEffect, useRef, useState } from "react";

function ChartControls({
  chartType,
  setChartType,
  activeRange,
  setActiveRange,
  selectedCoins,
  setSelectedCoins,
}) {
  const ranges = ["1D", "1W", "1M", "6M", "1Y"];

  const coins = [
    "Bitcoin",
    "Ethereum",
    "Tether",
    "XRP",
    "Binance",
  ];

  const [isCoinMenuOpen, setIsCoinMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsCoinMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  const toggleCoin = (coin) => {
    setSelectedCoins((current) => {
      if (current.includes(coin)) {
        if (current.length === 1) {
          return current;
        }

        return current.filter((item) => item !== coin);
      }

      return [...current, coin];
    });
  };

  const selectedText =
    selectedCoins.length === 1
      ? selectedCoins[0]
      : `${selectedCoins.length} Cryptocurrencies`;

  return (
    <div className="flex flex-col gap-3">
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

        {/* Cryptocurrency dropdown */}
        <div className="flex flex-wrap items-center gap-2">
          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsCoinMenuOpen((open) => !open)
              }
              className="flex min-w-[190px] items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none"
            >
              <span className="text-gray-700">
                {selectedText}
              </span>

              <span className="ml-3 text-gray-400">
                {isCoinMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isCoinMenuOpen && (
              <div className="absolute right-0 z-50 mt-1 w-[210px] rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                {coins.map((coin) => {
                  const selected =
                    selectedCoins.includes(coin);

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

          {/* Chart type */}
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
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
