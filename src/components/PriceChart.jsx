import React, { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

import { getCoinMarketChart } from "../services/coinGeckoApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

/* =====================================================
   COIN IDS
===================================================== */

const coinIds = {
  Bitcoin: "bitcoin",
  Ethereum: "ethereum",
  Tether: "tether",
  XRP: "ripple",
  Binance: "binancecoin",
};

/* =====================================================
   COIN COLORS
===================================================== */

const coinColors = {
  Bitcoin: "#f59e0b",
  Ethereum: "#3b82f6",
  Tether: "#10b981",
  XRP: "#8b5cf6",
  Binance: "#eab308",
};

/* =====================================================
   RANGE
===================================================== */

const rangeDays = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
};

/* =====================================================
   PRICE CHART
===================================================== */

function PriceChart({
  chartType = "line",
  selectedCoins = ["Ethereum"],
  activeRange = "1W",
  currency = "usd",
}) {
  const [coinData, setCoinData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===================================================
     FETCH DATA
  =================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      if (!selectedCoins || selectedCoins.length === 0) {
        setCoinData([]);
        setError("Please select a cryptocurrency.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const days = rangeDays[activeRange] || 7;

        /*
         * Fetch each selected cryptocurrency separately.
         *
         * IMPORTANT:
         * We preserve the coin name together with its
         * response so Ethereum can never accidentally
         * receive Bitcoin's data.
         */

        const results = await Promise.all(
          selectedCoins.map(async (coin) => {
            const coinId = coinIds[coin];

            if (!coinId) {
              return {
                coin,
                prices: [],
              };
            }

            const response = await getCoinMarketChart(
              coinId,
              currency,
              days
            );

            return {
              coin,
              coinId,
              prices: Array.isArray(response?.prices)
                ? response.prices
                : [],
            };
          })
        );

        if (cancelled) return;

        const validResults = results.filter(
          (item) => item.prices.length > 0
        );

        if (validResults.length === 0) {
          setCoinData([]);
          setError("Unable to load chart data.");
          return;
        }

        setCoinData(validResults);
      } catch (err) {
        console.error("Price chart error:", err);

        if (!cancelled) {
          setCoinData([]);
          setError("Unable to load chart data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [selectedCoins, activeRange, currency]);

  /* ===================================================
     BUILD CHART DATA
  =================================================== */

  const processedData = useMemo(() => {
    if (!coinData.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    /*
     * Use the longest dataset as our timeline.
     */
    const longestLength = Math.max(
      ...coinData.map((item) => item.prices.length)
    );

    /*
     * Number of visible points.
     *
     * We reduce the number of points for readability,
     * but do NOT change the actual price values.
     */
    let pointCount = 12;

    if (activeRange === "1D") {
      pointCount = 12;
    }

    if (activeRange === "1W") {
      pointCount = 12;
    }

    if (activeRange === "1M") {
      pointCount = 10;
    }

    if (activeRange === "6M") {
      pointCount = 12;
    }

    if (activeRange === "1Y") {
      pointCount = 12;
    }

    pointCount = Math.min(
      pointCount,
      longestLength
    );

    /*
     * Pick evenly spaced indexes.
     */
    const indexes = [];

    if (pointCount === 1) {
      indexes.push(0);
    } else {
      for (let i = 0; i < pointCount; i++) {
        const index = Math.round(
          (i * (longestLength - 1)) /
            (pointCount - 1)
        );

        indexes.push(index);
      }
    }

    /* =================================================
       LABELS
    ================================================= */

    const labels = indexes.map((index) => {
      const timestamp =
        coinData[0]?.prices[index]?.[0];

      if (!timestamp) {
        return "";
      }

      const date = new Date(timestamp);

      if (activeRange === "1D") {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        });
      }

      if (activeRange === "1W") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      if (activeRange === "1M") {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    });

    /* =================================================
       DATASETS
    ================================================= */

    const datasets = coinData.map(
      (item, index) => {
        const color =
          coinColors[item.coin] || "#3b82f6";

        /*
         * FIRST COIN:
         * left Y axis
         *
         * SECOND COIN:
         * right Y axis
         *
         * Both axes are REAL currency values.
         */

        const yAxisId =
          index === 0 ? "y" : "y1";

        const values = indexes.map(
          (pointIndex) => {
            const value =
              item.prices[pointIndex]?.[1];

            if (
              value === null ||
              value === undefined ||
              !Number.isFinite(Number(value))
            ) {
              return null;
            }

            return Number(value);
          }
        );

        return {
          label: item.coin,

          data: values,

          yAxisID: yAxisId,

          borderColor: color,

          backgroundColor: color,

          borderWidth: 2,

          tension: 0.3,

          pointRadius:
            chartType === "bar" ? 0 : 2,

          pointHoverRadius: 5,

          pointBackgroundColor: color,

          pointBorderColor: color,

          fill: false,

          /*
           * BAR SETTINGS
           */
          ...(chartType === "bar"
            ? {
                borderRadius: 3,

                barPercentage: 0.7,

                categoryPercentage: 0.7,
              }
            : {}),
        };
      }
    );

    return {
      labels,
      datasets,
    };
  }, [
    coinData,
    activeRange,
    chartType,
  ]);

  /* ===================================================
     FORMAT VALUES
  =================================================== */

  const formatCurrency = (value) => {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(Number(value))
    ) {
      return "";
    }

    const numericValue = Number(value);

    const currencyCode =
      currency.toUpperCase();

    if (Math.abs(numericValue) >= 1000000000) {
      return `${currencyCode} ${(
        numericValue / 1000000000
      ).toFixed(1)}B`;
    }

    if (Math.abs(numericValue) >= 1000000) {
      return `${currencyCode} ${(
        numericValue / 1000000
      ).toFixed(1)}M`;
    }

    if (Math.abs(numericValue) >= 1000) {
      return `${currencyCode} ${(
        numericValue / 1000
      ).toFixed(1)}K`;
    }

    if (Math.abs(numericValue) < 10) {
      return `${currencyCode} ${numericValue.toFixed(
        2
      )}`;
    }

    return `${currencyCode} ${Math.round(
      numericValue
    ).toLocaleString()}`;
  };

  /* ===================================================
     CHART OPTIONS
  =================================================== */

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    animation: {
      duration: 300,
    },

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "top",

        align: "end",

        labels: {
          usePointStyle: true,

          pointStyle: "circle",

          boxWidth: 8,

          boxHeight: 8,

          padding: 14,

          color: "#64748b",

          font: {
            size: 11,
          },
        },
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value =
              context.parsed.y;

            return `${context.dataset.label}: ${formatCurrency(
              value
            )}`;
          },
        },
      },
    },

    scales: {
      /* ===============================================
         LEFT AXIS
      =============================================== */

      y: {
        type: "linear",

        position: "left",

        beginAtZero: true,

        grid: {
          color: "#e5e7eb",
        },

        border: {
          display: false,
        },

        title: {
          display: true,

          text: currency.toUpperCase(),

          color: "#334155",

          font: {
            size: 11,

            weight: "600",
          },
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 10,
          },

          callback: (value) =>
            formatCurrency(value),
        },
      },

      /* ===============================================
         RIGHT AXIS
      =============================================== */

      y1: {
        type: "linear",

        position: "right",

        beginAtZero: true,

        display:
          selectedCoins.length > 1,

        grid: {
          drawOnChartArea: false,
        },

        border: {
          display: false,
        },

        title: {
          display:
            selectedCoins.length > 1,

          /*
           * IMPORTANT:
           * This is USD / INR / EUR / GBP,
           * NOT "BITCOIN".
           */
          text: currency.toUpperCase(),

          color: "#334155",

          font: {
            size: 11,

            weight: "600",
          },
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 10,
          },

          callback: (value) =>
            formatCurrency(value),
        },
      },

      /* ===============================================
         X AXIS
      =============================================== */

      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 10,
          },

          maxRotation: 0,
        },
      },
    },
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <span className="text-xs text-gray-400">
          Loading chart data...
        </span>
      </div>
    );
  }

  /* ===================================================
     ERROR
  =================================================== */

  if (error) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <span className="text-xs text-red-500">
          {error}
        </span>
      </div>
    );
  }

  /* ===================================================
     EMPTY
  =================================================== */

  if (
    !processedData.labels.length ||
    !processedData.datasets.length
  ) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <span className="text-xs text-gray-400">
          No chart data available.
        </span>
      </div>
    );
  }

  /* ===================================================
     RENDER
  =================================================== */

  return (
    <div className="h-[300px] w-full">
      {chartType === "bar" ? (
        <Bar
          data={processedData}
          options={options}
        />
      ) : (
        <Line
          data={processedData}
          options={options}
        />
      )}
    </div>
  );
}

export default PriceChart;
