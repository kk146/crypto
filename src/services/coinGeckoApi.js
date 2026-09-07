import axios from "axios";

const BASE_URL =
  "https://api.coingecko.com/api/v3";

/* =====================================================
   API CONFIG
===================================================== */

const apiConfig = {};

if (import.meta.env.VITE_COINGECKO_API_KEY) {
  apiConfig.headers = {
    "x-cg-demo-api-key":
      import.meta.env.VITE_COINGECKO_API_KEY,
  };
}

/* =====================================================
   TOP COINS
===================================================== */

export const getTopCoins = async (
  currency = "usd"
) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency: currency.toLowerCase(),

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
      "Error fetching top coins:",
      error?.response?.data || error
    );

    return [];
  }
};

/* =====================================================
   COIN MARKET CHART
===================================================== */

export const getCoinMarketChart = async (
  coinId,
  currency = "usd",
  days = 7
) => {
  try {
    /*
     * Make sure these values are strings/numbers
     * in exactly the format CoinGecko expects.
     */

    const cleanCoinId =
      String(coinId).trim();

    const cleanCurrency =
      String(currency)
        .trim()
        .toLowerCase();

    const cleanDays = Number(days);

    console.log(
      "Fetching chart:",
      cleanCoinId,
      cleanCurrency,
      cleanDays
    );

    const response = await axios.get(
      `${BASE_URL}/coins/${cleanCoinId}/market_chart`,
      {
        params: {
          vs_currency: cleanCurrency,

          days: cleanDays,
        },

        ...apiConfig,
      }
    );

    /*
     * Make sure we actually received price data.
     */

    if (
      !response.data ||
      !Array.isArray(response.data.prices)
    ) {
      console.error(
        "Invalid CoinGecko chart response:",
        response.data
      );

      return null;
    }

    return response.data;
  } catch (error) {
    console.error(
      `Error fetching ${coinId} chart data:`,
      error?.response?.data || error
    );

    return null;
  }
};

/* =====================================================
   EXCHANGE RATE
===================================================== */

export const getExchangeRate = async (
  fromId,
  toCurrency = "usd"
) => {
  try {
    const cleanCurrency =
      String(toCurrency)
        .trim()
        .toLowerCase();

    const response = await axios.get(
      `${BASE_URL}/simple/price`,
      {
        params: {
          ids: fromId,

          vs_currencies: cleanCurrency,
        },

        ...apiConfig,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error fetching exchange rate:",
      error?.response?.data || error
    );

    return null;
  }
};
