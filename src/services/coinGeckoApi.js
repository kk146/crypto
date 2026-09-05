import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

// Optional API key support
const apiConfig = {};

if (import.meta.env.VITE_COINGECKO_API_KEY) {
  apiConfig.headers = {
    "x-cg-demo-api-key":
      import.meta.env.VITE_COINGECKO_API_KEY,
  };
}

// Get top cryptocurrencies
export const getTopCoins = async (currency = "usd") => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 20,
          page: 1,
          sparkline: false,
        },
        ...apiConfig,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching coins:",
      error
    );

    return [];
  }
};

// Get historical cryptocurrency prices
export const getCoinMarketChart = async (
  coinId,
  currency = "usd",
  days = 7
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/${coinId}/market_chart`,
      {
        params: {
          vs_currency: currency,
          days,
        },
        ...apiConfig,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching ${coinId} chart data:`,
      error
    );

    return null;
  }
};

// Get current cryptocurrency exchange rates
export const getExchangeRate = async (
  fromId,
  toId,
  currency = "usd"
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/simple/price`,
      {
        params: {
          ids: `${fromId},${toId}`,
          vs_currencies: currency,
        },
        ...apiConfig,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching exchange rate:",
      error
    );

    return null;
  }
};
