import React, { useEffect, useRef, useState } from "react";

function ChartControls({
  chartType,
  setChartType,
  activeRange,
  setActiveRange,
  selectedCoins,
  toggleCoin,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const ranges = ["1D", "1W", "1M", "6M", "1Y"];

  const coins = [
    "Bitcoin",
    "Ethereum",
    "Tether",
    "XRP",
    "Binance",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleCoinClick = (coin) => {
    toggleCoin(coin);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* RANGE BUTTONS */}
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
          {/* CRYPTO SELECTOR */}
          <div
            ref={dropdownRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() => setIsOpen((value) => !value)}
              className="flex h-[32px] w-[180px] items-center justify-between rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700"
            >
              <span>
                {selectedCoins.length === 1
                  ? selectedCoins[0]
                  : `${selectedCoins.length} Cryptocurrencies`}
              </span>

              <span className="text-[10px] text-gray-500">
                {isOpen ? "▲" : "▼"}
              </span>
            </button>

            {isOpen && (
              <div
                className="absolute right-0 top-[38px] z-[9999] w-[220px] rounded-md border border-gray-200 bg-white p-2 shadow-xl"
                style={{
                  color: "#374151",
                }}
              >
                {coins.map((coin) => {
                  const selected =
                    selectedCoins.includes(coin);

                  return (
                    <button
                      key={coin}
                      type="button"
                      onClick={() =>
                        handleCoinClick(coin)
                      }
                      className={`flex w-full items-center gap-3 rounded-md px-2 py-2 text-left ${
                        selected
                          ? "bg-blue-50"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      {/* CUSTOM CHECKBOX */}
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          selected
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-400 bg-white"
                        }`}
                      >
                        {selected && (
                          <span className="text-[11px] font-bold text-white">
                            ✓
                          </span>
                        )}
                      </span>

                      {/* COIN NAME */}
                      <span
                        className="text-xs font-medium"
                        style={{
                          color: "#374151",
                          opacity: 1,
                          visibility: "visible",
                        }}
                      >
                        {coin}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* CHART TYPE */}
          <select
            value={chartType}
            onChange={(e) =>
              setChartType(e.target.value)
            }
            className="h-[32px] rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      {/* SELECTED */}
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
