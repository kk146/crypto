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

const COIN_IDS = {
  Bitcoin: "bitcoin",
  Ethereum: "ethereum",
  Tether: "tether",
  XRP: "ripple",
  Binance: "binancecoin",
};

const COIN_COLORS = {
  Bitcoin: "#f7931a",
  Ethereum: "#3b82f6",
  Tether: "#10b981",
  XRP: "#8b5cf6",
  Binance: "#f59e0b",
};

const RANGE_DAYS = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "6M": 180,
  "1Y": 365,
};

function getRangeDays(activeRange) {
  return RANGE_DAYS[activeRange] || 7;
}

function formatCurrency(value, currency) {
  if (value === null || value === undefined) {
    return "N/A";
  }

  return `${Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })} ${currency.toUpperCase()}`;
}

/*
  Reduce line-chart points so the chart remains readable.
*/
function reduceLinePoints(points, activeRange) {
  if (!points || points.length === 0) {
    return [];
  }

  let maxPoints = 50;

  if (activeRange === "1D") {
    maxPoints = 24;
  }

  if (activeRange === "1W") {
    maxPoints = 35;
  }

  if (activeRange === "1M") {
    maxPoints = 31;
  }

  if (activeRange === "6M") {
    maxPoints = 30;
  }

  if (activeRange === "1Y") {
    maxPoints = 40;
  }

  const step = Math.max(
    1,
    Math.ceil(points.length / maxPoints)
  );

  return points.filter(
    (_, index) => index % step === 0
  );
}

/*
  Create clean labels for the bar chart.

  The bar chart uses monthly buckets for longer
  ranges, giving the clean Jan / Feb / Mar style
  shown in your reference image.
*/
function createBarBuckets(points, activeRange) {
  if (!points || points.length === 0) {
    return [];
  }

  const buckets = {};

  points.forEach(([timestamp, price]) => {
    const date = new Date(timestamp);

    let key;

    if (
      activeRange === "6M" ||
      activeRange === "1Y"
    ) {
      key = `${date.getFullYear()}-${date.getMonth()}`;
    } else if (activeRange === "1M") {
      key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    } else {
      key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    if (!buckets[key]) {
      buckets[key] = {
        timestamp,
        values: [],
      };
    }

    buckets[key].values.push(price);
  });

  return Object.values(buckets).map((bucket) => {
    const average =
      bucket.values.reduce(
        (sum, value) => sum + value,
        0
      ) / bucket.values.length;

    return {
      timestamp: bucket.timestamp,
      value: average,
    };
  });
}

function formatBarLabel(timestamp, activeRange) {
  const date = new Date(timestamp);

  if (
    activeRange === "6M" ||
    activeRange === "1Y"
  ) {
    return date.toLocaleDateString([], {
      month: "short",
    });
  }

  if (activeRange === "1M") {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function PriceChart({
  chartType,
  selectedCoins,
  activeRange,
  currency = "usd",
}) {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
    Fetch data whenever:
    - cryptocurrency selection changes
    - range changes
    - currency changes
  */
  useEffect(() => {
    let cancelled = false;

    const loadCharts = async () => {
      if (
        !selectedCoins ||
        selectedCoins.length === 0
      ) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const days = getRangeDays(activeRange);

        const results = await Promise.all(
          selectedCoins.map(async (coin) => {
            const coinId = COIN_IDS[coin];

            if (!coinId) {
              return {
                coin,
                data: null,
              };
            }

            const data =
              await getCoinMarketChart(
                coinId,
                currency,
                days
              );

            return {
              coin,
              data,
            };
          })
        );

        if (cancelled) {
          return;
        }

        const validResults = results.filter(
          (result) =>
            result.data &&
            result.data.prices &&
            result.data.prices.length > 0
        );

        if (validResults.length === 0) {
          setError("Unable to load chart data.");
          setRawData([]);
          return;
        }

        setRawData(validResults);
      } catch (err) {
        console.error(
          "Price Chart Error:",
          err
        );

        if (!cancelled) {
          setError("Unable to load chart data.");
          setRawData([]);
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
  }, [
    selectedCoins,
    activeRange,
    currency,
  ]);

  /*
    Build the chart data.
  */
  const chartData = useMemo(() => {
    if (!rawData.length) {
      return null;
    }

    /*
      BAR CHART
    */
    if (chartType === "bar") {
      const allBuckets = [];

      rawData.forEach(({ data }) => {
        const buckets = createBarBuckets(
          data.prices,
          activeRange
        );

        buckets.forEach((bucket) => {
          const label = formatBarLabel(
            bucket.timestamp,
            activeRange
          );

          if (!allBuckets.includes(label)) {
            allBuckets.push(label);
          }
        });
      });

      const datasets = rawData.map(
        ({ coin, data }) => {
          const buckets = createBarBuckets(
            data.prices,
            activeRange
          );

          const bucketMap = {};

          buckets.forEach((bucket) => {
            const label = formatBarLabel(
              bucket.timestamp,
              activeRange
            );

            bucketMap[label] = bucket.value;
          });

          return {
            label: coin,

            data: allBuckets.map(
              (label) =>
                bucketMap[label] ?? null
            ),

            backgroundColor:
              COIN_COLORS[coin] ||
              "#3b82f6",

            borderColor:
              COIN_COLORS[coin] ||
              "#3b82f6",

            borderWidth: 0,

            borderRadius: 2,

            barPercentage: 0.7,

            categoryPercentage: 0.65,
          };
        }
      );

      return {
        labels: allBuckets,
        datasets,
      };
    }

    /*
      LINE CHART
    */
    const referencePoints =
      reduceLinePoints(
        rawData[0].data.prices,
        activeRange
      );

    const labels = referencePoints.map(
      ([timestamp]) => {
        const date = new Date(timestamp);

        if (activeRange === "1D") {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
        }

        return date.toLocaleDateString([], {
          month: "short",
          day: "numeric",
        });
      }
    );

    const datasets = rawData.map(
      ({ coin, data }) => {
        const points = reduceLinePoints(
          data.prices,
          activeRange
        );

        return {
          label: coin,

          data: points.map(
            ([, price]) => price
          ),

          borderColor:
            COIN_COLORS[coin] ||
            "#3b82f6",

          backgroundColor: "transparent",

          borderWidth: 2,

          pointRadius: 2,

          pointHoverRadius: 5,

          tension: 0.25,

          fill: false,
        };
      }
    );

    return {
      labels,
      datasets,
    };
  }, [
    rawData,
    chartType,
    activeRange,
  ]);

  /*
    Chart options
  */
  const options = useMemo(() => {
    const isBar = chartType === "bar";

    return {
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

            pointStyle: "circle",

            boxWidth: 8,

            boxHeight: 8,

            padding: 12,

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
                value,
                currency
              )}`;
            },
          },
        },
      },

      scales: {
        x: {
          stacked: false,

          grid: {
            display: false,
          },

          ticks: {
            color: "#6b7280",

            font: {
              size: 10,
            },

            maxTicksLimit: isBar
              ? 8
              : activeRange === "1D"
              ? 8
              : 7,
          },
        },

        y: {
          beginAtZero: isBar,

          stacked: false,

          grid: {
            color: "#f1f5f9",
          },

          title: {
            display: true,

            text: currency.toUpperCase(),

            color: "#374151",

            font: {
              size: 10,

              weight: "600",
            },
          },

          ticks: {
            color: "#6b7280",

            font: {
              size: 10,
            },

            callback: (value) => {
              return Number(value).toLocaleString(
                undefined,
                {
                  maximumFractionDigits: 0,
                }
              );
            },
          },
        },
      },
    };
  }, [
    chartType,
    selectedCoins.length,
    activeRange,
    currency,
  ]);

  if (loading) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-gray-400">
        Loading chart...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-red-400">
        {error}
      </div>
    );
  }

  if (
    !chartData ||
    !chartData.labels ||
    chartData.datasets.length === 0
  ) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-sm text-gray-400">
        No chart data available.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      {chartType === "bar" ? (
        <Bar
          data={chartData}
          options={options}
        />
      ) : (
        <Line
          data={chartData}
          options={options}
        />
      )}
    </div>
  );
}

export default PriceChart;
