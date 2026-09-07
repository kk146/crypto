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
  const [sellCurrency, setSellCurrency] =
    useState("Bitcoin");

  const [buyCurrency, setBuyCurrency] =
    useState("Ethereum");

  const [amount, setAmount] = useState("");

  const [result, setResult] = useState("");

  const [loading, setLoading] = useState(false);

  // Check whether a currency is crypto
  const isCrypto = (currency) => {
    return Boolean(currencyIds[currency]);
  };

  // Get crypto price in a selected fiat currency
  const getCryptoRate = async (
    cryptoName,
    fiatCurrency
  ) => {
    const cryptoId = currencyIds[cryptoName];

    if (!cryptoId) {
      return null;
    }

    const data = await getExchangeRate(
      cryptoId,
      fiatCurrency.toLowerCase()
    );

    return (
      data?.[cryptoId]?.[
        fiatCurrency.toLowerCase()
      ] ?? null
    );
  };

  // Get fiat-to-fiat exchange rate
  const getFiatRate = async (
    fromCurrency,
    toCurrency
  ) => {
    const response = await fetch(
      `https://api.frankfurter.app/latest?from=${fromCurrency}&to=${toCurrency}`
    );

    if (!response.ok) {
      throw new Error(
        "Unable to fetch fiat exchange rate"
      );
    }

    const data = await response.json();

    return data?.rates?.[toCurrency] ?? null;
  };

  // Format final result
  const formatResult = (
    value,
    currency
  ) => {
    return `${value.toLocaleString(
      undefined,
      {
        maximumFractionDigits: 8,
      }
    )} ${currency}`;
  };

  const handleExchange = async () => {
    const numericAmount = Number(amount);

    // Validate amount
    if (
      !amount ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      alert("Please enter a valid value");
      return;
    }

    // Same currency
    if (sellCurrency === buyCurrency) {
      setResult(
        formatResult(
          numericAmount,
          buyCurrency
        )
      );
      return;
    }

    setLoading(true);
    setResult("");

    try {
      let exchangeRate = null;

      /*
      ============================================
      1. CRYPTO → CRYPTO
      ============================================
      Example:
      1 Bitcoin → Ethereum
      1 Ethereum → Bitcoin
      */

      if (
        isCrypto(sellCurrency) &&
        isCrypto(buyCurrency)
      ) {
        const sellPriceUSD =
          await getCryptoRate(
            sellCurrency,
            "USD"
          );

        const buyPriceUSD =
          await getCryptoRate(
            buyCurrency,
            "USD"
          );

        if (
          sellPriceUSD !== null &&
          buyPriceUSD !== null &&
          buyPriceUSD > 0
        ) {
          exchangeRate =
            sellPriceUSD / buyPriceUSD;
        }
      }

      /*
      ============================================
      2. CRYPTO → FIAT
      ============================================
      Example:
      1 Bitcoin → INR
      1 Ethereum → EUR
      1 Bitcoin → GBP
      */

      else if (
        isCrypto(sellCurrency) &&
        fiatCurrencies.includes(
          buyCurrency
        )
      ) {
        exchangeRate =
          await getCryptoRate(
            sellCurrency,
            buyCurrency
          );
      }

      /*
      ============================================
      3. FIAT → CRYPTO
      ============================================
      Example:
      1000 INR → Bitcoin
      1000 EUR → Ethereum
      */

      else if (
        fiatCurrencies.includes(
          sellCurrency
        ) &&
        isCrypto(buyCurrency)
      ) {
        const cryptoPrice =
          await getCryptoRate(
            buyCurrency,
            sellCurrency
          );

        if (
          cryptoPrice !== null &&
          cryptoPrice > 0
        ) {
          exchangeRate =
            1 / cryptoPrice;
        }
      }

      /*
      ============================================
      4. FIAT → FIAT
      ============================================
      Example:
      1000 EUR → INR
      1000 USD → INR
      1000 GBP → EUR
      */

      else if (
        fiatCurrencies.includes(
          sellCurrency
        ) &&
        fiatCurrencies.includes(
          buyCurrency
        )
      ) {
        exchangeRate =
          await getFiatRate(
            sellCurrency,
            buyCurrency
          );
      }

      // Make sure a valid rate was received
      if (
        exchangeRate === null ||
        exchangeRate === undefined ||
        !Number.isFinite(exchangeRate)
      ) {
        setResult("Rate unavailable");
        return;
      }

      // Calculate converted amount
      const convertedAmount =
        numericAmount * exchangeRate;

      setResult(
        formatResult(
          convertedAmount,
          buyCurrency
        )
      );
    } catch (error) {
      console.error(
        "Exchange error:",
        error
      );

      setResult(
        "Unable to get exchange rate"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white">

      {/* ========================================
          HEADING
      ======================================== */}

      <h2 className="mb-5 text-[15px] font-semibold text-black">
        Exchange Coins
      </h2>

      {/* ========================================
          SELL ROW
      ======================================== */}

      <div className="flex w-full items-center gap-3">

        {/* Sell label */}

        <div className="w-[30px] shrink-0">
          <span className="text-[10px] font-medium text-[#ff6b22]">
            Sell
          </span>
        </div>

        {/* Sell currency */}

        <div className="relative flex-1">
          <select
            value={sellCurrency}
            onChange={(e) => {
              setSellCurrency(
                e.target.value
              );
              setResult("");
            }}
            className="h-[40px] w-full appearance-none rounded-[9px] border-0 bg-[#f8f8f8] px-3 pr-8 text-[10px] font-semibold text-[#64748b] outline-none"
          >
            {currencies.map(
              (currency) => (
                <option
                  key={currency}
                  value={currency}
                >
                  {currency}
                </option>
              )
            )}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-black">
            ▼
          </span>
        </div>

        {/* Amount */}

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
              setAmount(
                e.target.value
              );
              setResult("");
            }}
            placeholder="Enter amount"
            className="h-[40px] w-full rounded-[9px] border border-[#eeeeee] bg-white px-3 text-[9px] text-[#555555] outline-none placeholder:text-[#b7b7b7]"
          />
        </div>
      </div>

      {/* ========================================
          BUY ROW
      ======================================== */}

      <div className="mt-5 flex w-full items-center gap-3">

        {/* Buy label */}

        <div className="w-[30px] shrink-0">
          <span className="text-[10px] font-medium text-[#42a58e]">
            Buy
          </span>
        </div>

        {/* Buy currency */}

        <div className="relative flex-1">
          <select
            value={buyCurrency}
            onChange={(e) => {
              setBuyCurrency(
                e.target.value
              );
              setResult("");
            }}
            className="h-[40px] w-full appearance-none rounded-[9px] border-0 bg-[#f8f8f8] px-3 pr-8 text-[10px] font-semibold text-[#64748b] outline-none"
          >
            {currencies.map(
              (currency) => (
                <option
                  key={currency}
                  value={currency}
                >
                  {currency}
                </option>
              )
            )}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-black">
            ▼
          </span>
        </div>

        {/* Result */}

        <div className="flex-1">
          <span className="whitespace-nowrap text-[10px] font-semibold text-[#42a58e]">
            {loading
              ? "Calculating..."
              : result || "Enter value"}
          </span>
        </div>
      </div>

      {/* ========================================
          EXCHANGE BUTTON
      ======================================== */}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleExchange}
          disabled={loading}
          className="h-[40px] min-w-[112px] rounded-[8px] bg-[#2864dc] px-6 text-[10px] font-medium text-white shadow-md transition hover:bg-[#1f56c5] disabled:opacity-60"
        >
          {loading
            ? "Loading..."
            : "Exchange"}
        </button>
      </div>

    </div>
  );
}

export default ExchangeCoins;
