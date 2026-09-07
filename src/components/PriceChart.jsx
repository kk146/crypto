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

const coinIds = {
  Bitcoin: "bitcoin",
  Ethereum: "ethereum",
  Tether: "tether",
  XRP: "ripple",
  Binance: "binancecoin",
};

const coinColors = {
  Bitcoin: "#f59e0b",
  Ethereum: "#3b82f6",
  Tether: "#10b981",
  XRP: "#8b5cf6",
  Binance: "#eab308",
};

const rangeDays = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
};

function PriceChart({
  chartType = "line",
  selectedCoins = ["Ethereum"],
  activeRange = "1W",
  currency = "usd",
}) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadCharts = async () => {
      if (!selectedCoins || selectedCoins.length === 0) {
        setChartData([]);
        setError("Select at least one cryptocurrency.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const days = rangeDays[activeRange] || 7;

        const responses = await Promise.all(
          selectedCoins.map(async (coin) => {
            const coinId = coinIds[coin];

            if (!coinId) {
              return {
                coin,
                prices: [],
              };
            }

            const data = await getCoinMarketChart(
              coinId,
              currency,
              days
            );

            return {
              coin,
              prices: data?.prices || [],
            };
          })
        );

        if (cancelled) return;

        const validData = responses.filter(
          (item) => item.prices.length > 0
        );

        if (validData.length === 0) {
          setChartData([]);
          setError("Unable to load chart data.");
          return;
        }

        setChartData(validData);
      } catch (err) {
        console.error("Chart Error:", err);

        if (!cancelled) {
          setChartData([]);
          setError("Unable to load chart data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCharts();

    return () => {
      cancelled = true;
    };
  }, [selectedCoins, activeRange, currency]);

  /*
   * Convert CoinGecko's many timestamp points into
   * a smaller number of readable points.
   *
   * This gives the graph the clean appearance
   * from your 3rd screenshot.
   */
  const processed = useMemo(() => {
    if (!chartData.length) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const longest = Math.max(
      ...chartData.map((item) => item.prices.length)
    );

    const pointCount =
      activeRange === "1D"
        ? 12
        : activeRange === "1W"
        ? 7
        : activeRange === "1M"
        ? 6
        : activeRange === "6M"
        ? 6
        : 6;

    const indexes = [];

    for (let i = 0; i < pointCount; i++) {
      const index = Math.round(
        (i * (longest - 1)) / (pointCount - 1 || 1)
      );

      indexes.push(index);
    }

    const labels = indexes.map((index) => {
      const firstCoin = chartData[0];

      const timestamp =
        firstCoin.prices[index]?.[0];

      if (!timestamp) return "";

      const date = new Date(timestamp);

      if (
        activeRange === "1D" ||
        activeRange === "1W"
      ) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
      });
    });

    const datasets = chartData.map((item, index) => {
      const prices = indexes.map(
        (pointIndex) =>
          item.prices[pointIndex]?.[1] ?? null
      );

      const color =
        coinColors[item.coin] || "#3b82f6";

      /*
       * IMPORTANT:
       *
       * First cryptocurrency uses y.
       * Second cryptocurrency uses y1.
       *
       * This prevents something like:
       *
       * Ethereum = $2,400
       * Tether   = $1
       *
       * from making Tether disappear.
       */
      const axis =
        chartType === "bar" && index === 1
          ? "y1"
          : "y";

      return {
        label: item.coin,
        data: prices,
        borderColor: color,
        backgroundColor: color,
        borderWidth: 2,

        yAxisID: axis,

        tension: 0.35,

        pointRadius:
          chartType === "bar" ? 0 : 2,

        pointHoverRadius: 4,

        fill: false,

        ...(chartType === "bar"
          ? {
              borderRadius: 2,
              barPercentage: 0.75,
              categoryPercentage: 0.65,
            }
          : {}),
      };
    });

    return {
      labels,
      datasets,
    };
  }, [chartData, activeRange, chartType]);

  const formatAxisValue = (value) => {
    const absolute = Math.abs(value);

    if (absolute >= 1000000000) {
      return `${currency.toUpperCase()} ${(value / 1000000000).toFixed(1)}B`;
    }

    if (absolute >= 1000000) {
      return `${currency.toUpperCase()} ${(value / 1000000).toFixed(1)}M`;
    }

    if (absolute >= 1000) {
      return `${currency.toUpperCase()} ${(value / 1000).toFixed(1)}K`;
    }

    if (absolute < 10) {
      return `${currency.toUpperCase()} ${value.toFixed(2)}`;
    }

    return `${currency.toUpperCase()} ${Math.round(value)}`;
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

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

          font: {
            size: 10,
          },

          color: "#64748b",
        },
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed.y;

            if (value === null || value === undefined) {
              return context.dataset.label;
            }

            return `${context.dataset.label}: ${formatAxisValue(
              value
            )}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#64748b",
          font: {
            size: 10,
          },
        },
      },

      y: {
        position: "left",

        beginAtZero: false,

        grid: {
          color: "#e5e7eb",
        },

        title: {
          display: true,
          text: currency.toUpperCase(),

          color: "#334155",

          font: {
            size: 10,
            weight: "600",
          },
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 9,
          },

          callback: (value) =>
            formatAxisValue(value),
        },
      },

      /*
       * SECOND Y AXIS
       *
       * Only really matters when two coins
       * have very different prices.
       */
      y1: {
        position: "right",

        display: selectedCoins.length > 1,

        beginAtZero: false,

        grid: {
          drawOnChartArea: false,
        },

        title: {
          display: selectedCoins.length > 1,
          text:
            selectedCoins.length > 1
              ? selectedCoins[1].toUpperCase()
              : "",

          color: "#64748b",

          font: {
            size: 10,
            weight: "600",
          },
        },

        ticks: {
          color: "#64748b",

          font: {
            size: 9,
          },

          callback: (value) =>
            formatAxisValue(value),
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <span className="text-xs text-gray-400">
          Loading chart data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <span className="text-xs text-red-500">
          {error}
        </span>
      </div>
    );
  }

  if (!processed.labels.length) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center">
        <span className="text-xs text-gray-400">
          No chart data available.
        </span>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      {chartType === "bar" ? (
        <Bar
          data={processed}
          options={options}
        />
      ) : (
        <Line
          data={processed}
          options={options}
        />
      )}
    </div>
  );
}

export default PriceChart;
