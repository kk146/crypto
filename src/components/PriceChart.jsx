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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

function PriceChart({
  chartType = "line",
  selectedCoins = ["Ethereum"],
}) {
  // --------------------------------------------------
  // Chart labels
  // --------------------------------------------------

  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "June"];

  // Full dates used inside the tooltip
  const dates = [
    "Jan 26, 2018",
    "Feb 26, 2018",
    "Mar 26, 2018",
    "Apr 26, 2018",
    "May 26, 2018",
    "Jun 26, 2018",
  ];

  // --------------------------------------------------
  // Sample cryptocurrency data
  // Later we can connect this to CoinGecko.
  // --------------------------------------------------

  const coinData = {
    Ethereum: {
      values: [800, 500, 1200, 500, 1200, 1800],
      color: "#9DB8FF",
    },

    Bitcoin: {
      values: [500, 600, 3000, 1000, 2500, 2000],
      color: "#F58B8B",
    },

    Tether: {
      values: [700, 900, 1400, 1100, 1600, 2100],
      color: "#55C7B0",
    },

    XRP: {
      values: [400, 700, 1000, 800, 1300, 1700],
      color: "#A78BFA",
    },

    Binance: {
      values: [600, 800, 1300, 900, 1500, 1900],
      color: "#F5C76B",
    },
  };

  // --------------------------------------------------
  // Make sure at least one coin is selected
  // --------------------------------------------------

  const coins =
    Array.isArray(selectedCoins) && selectedCoins.length > 0
      ? selectedCoins
      : ["Ethereum"];

  // --------------------------------------------------
  // Create datasets according to selected coins
  // --------------------------------------------------

  const datasets = coins
    .filter((coin) => coinData[coin])
    .map((coin) => {
      const coin = coinData[coin];

      return {
        label: coin,
        data: coin.values,

        borderColor: coin.color,
        backgroundColor: coin.color,

        borderWidth: 2,

        // Bar settings
        barPercentage: 0.55,
        categoryPercentage: 0.7,

        // Line settings
        tension: 0.25,
        pointRadius: 2,
        pointHoverRadius: 5,

        fill: false,
      };
    });

  // --------------------------------------------------
  // Chart data
  // --------------------------------------------------

  const data = {
    labels,
    datasets,
  };

  // --------------------------------------------------
  // Chart options
  // --------------------------------------------------

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      // ----------------------------------------------
      // Legend
      // ----------------------------------------------

      legend: {
        display: true,

        position: "top",
        align: "end",

        labels: {
          usePointStyle: true,
          pointStyle: "circle",

          boxWidth: 7,
          boxHeight: 7,

          padding: 10,

          font: {
            size: 9,
          },
        },
      },

      // ----------------------------------------------
      // Tooltip
      // ----------------------------------------------

      tooltip: {
        enabled: true,

        backgroundColor: "#ffffff",

        titleColor: "#9CA3AF",
        bodyColor: "#374151",

        borderColor: "#E5E7EB",
        borderWidth: 1,

        padding: 10,

        titleFont: {
          size: 10,
          weight: "normal",
        },

        bodyFont: {
          size: 10,
        },

        displayColors: true,

        callbacks: {
          // Full date
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;

            return dates[index];
          },

          // Cryptocurrency + market value
          label: (context) => {
            const value = context.raw;

            return `${context.dataset.label}  Market value $${Number(
              value
            ).toLocaleString()}`;
          },
        },
      },
    },

    // ------------------------------------------------
    // Axes
    // ------------------------------------------------

    scales: {
      x: {
        grid: {
          display: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#9CA3AF",

          font: {
            size: 9,
          },
        },
      },

      y: {
        beginAtZero: true,

        grid: {
          color: "#E5E7EB",
          drawBorder: false,
        },

        border: {
          display: false,
        },

        ticks: {
          color: "#9CA3AF",

          font: {
            size: 8,
          },

          callback: (value) => {
            if (value >= 1000) {
              return `${value / 1000}K`;
            }

            return value;
          },
        },
      },
    },
  };

  // --------------------------------------------------
  // Decide which chart to display
  // --------------------------------------------------

  const isLineChart =
    chartType === "line";

  const isHorizontalBar =
    chartType === "bar-chart-horizontal";

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="h-[245px] w-full">
      {isLineChart ? (
        <Line
          data={data}
          options={options}
        />
      ) : (
        <Bar
          data={data}
          options={{
            ...options,

            indexAxis: isHorizontalBar ? "y" : "x",

            scales: {
              ...options.scales,

              x: {
                ...options.scales.x,

                beginAtZero: !isHorizontalBar,

                grid: {
                  display: isHorizontalBar
                    ? true
                    : false,
                  color: "#E5E7EB",
                },
              },

              y: {
                ...options.scales.y,

                beginAtZero: true,

                grid: {
                  display: true,
                  color: "#E5E7EB",
                },
              },
            },
          }}
        />
      )}
    </div>
  );
}

export default PriceChart;
