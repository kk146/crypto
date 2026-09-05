import { useEffect, useState } from "react";

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
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadChartData = async () => {
      if (!selectedCoins.length) {
        setChartData(null);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");
      setChartData(null);

      try {
        const days = rangeDays[activeRange] || 7;

        const results = await Promise.all(
          selectedCoins.map(async (coinName) => {
            const coinId = coinIds[coinName];

            if (!coinId) {
              return null;
            }

            const result = await getCoinMarketChart(
              coinId,
              currency,
              days
            );

            return {
              name: coinName,
              coinId,
              data: result,
            };
          })
        );

        if (cancelled) return;

        const validResults = results.filter(
          (result) =>
            result?.data?.prices &&
            result.data.prices.length > 0
        );

        if (!validResults.length) {
          setError("No chart data was returned.");
          setChartData(null);
          return;
        }

        /*
         * Create a common timestamp list from all selected
         * cryptocurrencies.
         */
        const timestampSet = new Set();

        validResults.forEach((result) => {
          result.data.prices.forEach(([timestamp]) => {
            timestampSet.add(timestamp);
          });
        });

        const timestamps = Array.from(timestampSet).sort(
          (a, b) => a - b
        );

        /*
         * Limit the number of visible points for longer
         * ranges so the chart stays responsive.
         */
        let displayTimestamps = timestamps;

        if (activeRange === "6M" && timestamps.length > 90) {
          const step = Math.ceil(timestamps.length / 90);

          displayTimestamps = timestamps.filter(
            (_, index) => index % step === 0
          );
        }

        if (activeRange === "1Y" && timestamps.length > 100) {
          const step = Math.ceil(timestamps.length / 100);

          displayTimestamps = timestamps.filter(
            (_, index) => index % step === 0
          );
        }

        const labels = displayTimestamps.map(
          (timestamp) =>
            new Date(timestamp).toLocaleDateString(
              [],
              {
                month: "short",
                day: "numeric",
              }
            )
        );

        /*
         * Create one lookup table for every cryptocurrency.
         * This prevents values from being matched only by
         * array position.
         */
        const datasets = validResults.map((result) => {
          const priceMap = new Map(
            result.data.prices.map(
              ([timestamp, price]) => [
                timestamp,
                price,
              ]
            )
          );

          const data = displayTimestamps.map(
            (timestamp) => {
              if (priceMap.has(timestamp)) {
                return priceMap.get(timestamp);
              }

              /*
               * If the exact timestamp isn't available,
               * find the closest previous price.
               */
              let closestPrice = null;

              for (let i = timestamps.length - 1; i >= 0; i--) {
                const previousTimestamp =
                  timestamps[i];

                if (previousTimestamp <= timestamp) {
                  closestPrice =
                    priceMap.get(previousTimestamp) ??
                    null;
                  break;
                }
              }

              return closestPrice;
            }
          );

          return {
            label: result.name,

            data,

            borderColor:
              coinColors[result.name] ||
              "#3b82f6",

            backgroundColor:
              coinColors[result.name] ||
              "#3b82f6",

            borderWidth: 2,

            tension: 0.3,

            pointRadius:
              activeRange === "1D" ? 1 : 2,

            pointHoverRadius: 5,

            fill: false,

            barPercentage: 0.65,

            categoryPercentage: 0.75,
          };
        });

        setChartData({
          labels,
          datasets,
        });
      } catch (err) {
        console.error(
          "Chart data error:",
          err
        );

        if (!cancelled) {
          setError(
            "Unable to load cryptocurrency data."
          );

          setChartData(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadChartData();

    return () => {
      cancelled = true;
    };
  }, [selectedCoins, activeRange, currency]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        display: selectedCoins.length > 1,
        position: "top",

        labels: {
          usePointStyle: true,
          boxWidth: 8,

          font: {
            size: 11,
          },
        },
      },

      tooltip: {
        callbacks: {
          title: (items) => {
            return items[0]?.label || "";
          },

          label: (context) => {
            const value = context.parsed.y;

            if (typeof value !== "number") {
              return `${context.dataset.label}: -`;
            }

            return `${context.dataset.label}: ${value.toLocaleString(
              undefined,
              {
                maximumFractionDigits: 2,
              }
            )} ${currency.toUpperCase()}`;
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
          maxTicksLimit: 7,

          font: {
            size: 10,
          },
        },
      },

      y: {
        beginAtZero: false,

        grid: {
          color: "#f1f5f9",
        },

        ticks: {
          font: {
            size: 10,
          },

          callback: (value) =>
            Number(value).toLocaleString(
              undefined,
              {
                maximumFractionDigits: 0,
              }
            ),
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Loading market data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-sm text-gray-400">
          Select a cryptocurrency.
        </p>
      </div>
    );
  }

  const finalOptions = {
    ...options,

    indexAxis:
      chartType === "bar-chart-horizontal"
        ? "y"
        : "x",
  };

  if (chartType === "line") {
    return (
      <div className="h-[300px] w-full">
        <Line
          data={chartData}
          options={finalOptions}
        />
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <Bar
        data={chartData}
        options={finalOptions}
      />
    </div>
  );
}

export default PriceChart;
