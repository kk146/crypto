import { useEffect, useState } from "react";

const API_URL = "https://api.coingecko.com/api/v3";

function MarketCapList({ currency = "usd" }) {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch market cap data
  useEffect(() => {
    const fetchMarketCap = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=7&page=1&sparkline=false&price_change_percentage=24h`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        setCoins(data);
      } catch (err) {
        console.error("Market Cap Error:", err);
        setError("Unable to load market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarketCap();
  }, [currency]);

  // Format market cap
  const formatMarketCap = (value) => {
    if (value === null || value === undefined) {
      return "N/A";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format 24h change
  const formatChange = (value) => {
    if (value === null || value === undefined) {
      return "0.00%";
    }

    return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
  };

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 20px 14px 20px",
          borderBottom: "1px solid #eeeeee",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: "1.25",
            color: "#111111",
          }}
        >
          Cryptocurrency by
          <br />
          market cap
        </h2>
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{
            padding: "20px",
            fontSize: "13px",
            color: "#9ca3af",
          }}
        >
          Loading market data...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          style={{
            padding: "20px",
            fontSize: "13px",
            color: "#ef4444",
          }}
        >
          {error}
        </div>
      )}

      {/* Coins */}
      {!loading &&
        !error &&
        coins.map((coin, index) => {
          const change = coin.price_change_percentage_24h || 0;
          const isPositive = change >= 0;

          return (
            <div
              key={coin.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom:
                  index !== coins.length - 1
                    ? "1px solid #f0f0f0"
                    : "none",
              }}
            >
              {/* LEFT SIDE */}
              <div
                style={{
                  minWidth: 0,
                }}
              >
                {/* Coin Name */}
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#111111",
                    marginBottom: "4px",
                  }}
                >
                  {coin.name}
                </div>

                {/* Market Cap */}
                <div
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                  }}
                >
                  MktCap {formatMarketCap(coin.market_cap)}
                </div>
              </div>

              {/* RIGHT SIDE - CHANGE */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginLeft: "10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: isPositive ? "#2aa198" : "#f59e0b",
                }}
              >
                {/* SVG Arrow */}
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 10 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: isPositive
                      ? "rotate(0deg)"
                      : "rotate(180deg)",
                  }}
                >
                  <path
                    d="M5 1L9 5H6.5V9H3.5V5H1L5 1Z"
                    fill="currentColor"
                  />
                </svg>

                <span>{formatChange(change)}</span>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default MarketCapList;
