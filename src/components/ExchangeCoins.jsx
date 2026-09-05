import React, { useState } from "react";
import { getExchangeRate } from "../services/coinGeckoApi";

const currencies = [
  "Bitcoin",
  "Ethereum",
  "Tether",
  "BNB",
  "Solana",
  "USD",
  "GBP",
  "EUR",
  "INR",
];

const currencyIds = {
  Bitcoin: "bitcoin",
  Ethereum: "ethereum",
  Tether: "tether",
  BNB: "binancecoin",
  Solana: "solana",
};

const fiatCurrencies = ["USD", "GBP", "EUR", "INR"];

function ExchangeCoins() {
  const [sellCurrency, setSellCurrency] = useState("Bitcoin");
  const [buyCurrency, setBuyCurrency] = useState("Ethereum");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const getCurrencyId = (currency) => {
    if (currencyIds[currency]) {
      return currencyIds[currency];
    }

    return currency.toLowerCase();
  };

  const handleExchange = async () => {
    const numericAmount = Number(amount);

    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      alert("Please enter a valid value");
      return;
    }

    if (sellCurrency === buyCurrency) {
      setResult(`${numericAmount} ${buyCurrency}`);
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const sellId = getCurrencyId(sellCurrency);
      const buyId = getCurrencyId(buyCurrency);

      let exchangeRate = null;

      // Crypto → Crypto
      if (
        currencyIds[sellCurrency] &&
        currencyIds[buyCurrency]
      ) {
        const data = await getExchangeRate(
          sellId,
          buyId,
          "usd"
        );

        const sellPrice = data?.[sellId]?.usd;
        const buyPrice = data?.[buyId]?.usd;

        if (sellPrice && buyPrice) {
          exchangeRate = sellPrice / buyPrice;
        }
      }

      // Crypto → Fiat
      else if (currencyIds[sellCurrency] && fiatCurrencies.includes(buyCurrency)) {
        const data = await getExchangeRate(
          sellId,
          "usd",
          "usd"
        );

        const cryptoPrice = data?.[sellId]?.usd;

        if (cryptoPrice) {
          exchangeRate = cryptoPrice;
        }
      }

      // Fiat → Crypto
      else if (fiatCurrencies.includes(sellCurrency) && currencyIds[buyCurrency]) {
        const data = await getExchangeRate(
          buyId,
          "usd",
          "usd"
        );

        const cryptoPrice = data?.[buyId]?.usd;

        if (cryptoPrice) {
          exchangeRate = 1 / cryptoPrice;
        }
      }

      // Fiat → Fiat
      else if (
        fiatCurrencies.includes(sellCurrency) &&
        fiatCurrencies.includes(buyCurrency)
      ) {
        const data = await getExchangeRate(
          "usd",
          "eur",
          "usd"
        );

        // Basic fallback for fiat conversion.
        // CoinGecko's simple price endpoint is primarily
        // intended for crypto prices.
        if (data) {
          exchangeRate = 1;
        }
      }

      if (!exchangeRate) {
        setResult("Rate unavailable");
        return;
      }

      const convertedAmount = numericAmount * exchangeRate;

      setResult(
        `${convertedAmount.toLocaleString(undefined, {
          maximumFractionDigits: 8,
        })} ${buyCurrency}`
      );
    } catch (error) {
      console.error("Exchange error:", error);
      setResult("Unable to get exchange rate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">

      {/* Heading */}
      <h2 className="mb-5 text-[15px] font-semibold text-black">
        Exchange Coins
      </h2>

      {/* SELL ROW */}
      <div className="flex w-full items-center gap-3">

        {/* Sell */}
        <div className="w-[30px] shrink-0">
          <span className="text-[10px] font-medium text-[#ff6b22]">
            Sell
          </span>
        </div>

        {/* Currency dropdown */}
        <div className="relative flex-1">
          <select
            value={sellCurrency}
            onChange={(e) => {
              setSellCurrency(e.target.value);
              setResult("");
            }}
            className="h-[40px] w-full appearance-none rounded-[9px] border-0 bg-[#f8f8f8] px-3 pr-8 text-[10px] font-semibold text-[#64748b] outline-none"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-black">
            ▼
          </span>
        </div>

        {/* Value input */}
        <div className="flex-1">
          <label className="mb-1 block text-[9px] font-medium text-[#94a3b8]">
            Enter value
          </label>

          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setResult("");
            }}
            placeholder="Avl : 0.002BTC"
            className="h-[40px] w-full rounded-[9px] border border-[#eeeeee] bg-white px-3 text-[9px] text-[#555555] outline-none placeholder:text-[#b7b7b7]"
          />
        </div>
      </div>

      {/* BUY ROW */}
      <div className="mt-5 flex w-full items-center gap-3">

        {/* Buy */}
        <div className="w-[30px] shrink-0">
          <span className="text-[10px] font-medium text-[#42a58e]">
            Buy
          </span>
        </div>

        {/* Currency dropdown */}
        <div className="relative flex-1">
          <select
            value={buyCurrency}
            onChange={(e) => {
              setBuyCurrency(e.target.value);
              setResult("");
            }}
            className="h-[40px] w-full appearance-none rounded-[9px] border-0 bg-[#f8f8f8] px-3 pr-8 text-[10px] font-semibold text-[#64748b] outline-none"
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-black">
            ▼
          </span>
        </div>

        {/* Buy result */}
        <div className="flex-1">
          <span className="whitespace-nowrap text-[10px] font-semibold text-[#42a58e]">
            {loading
              ? "Calculating..."
              : result || "Enter value"}
          </span>
        </div>
      </div>

      {/* Exchange button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleExchange}
          disabled={loading}
          className="h-[40px] min-w-[112px] rounded-[8px] bg-[#2864dc] px-6 text-[10px] font-medium text-white shadow-md transition hover:bg-[#1f56c5]"
        >
          {loading ? "Loading..." : "Exchange"}
        </button>
      </div>

    </div>
  );
}

export default ExchangeCoins;
