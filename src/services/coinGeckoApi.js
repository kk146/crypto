import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

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
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching coins:", error);
    return [];
  }
};