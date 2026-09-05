import React, { useState } from "react";

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

function ExchangeCoins() {
  const [sellCurrency, setSellCurrency] = useState("Bitcoin");
  const [buyCurrency, setBuyCurrency] = useState("Ethereum");
  const [amount, setAmount] = useState("");

  const handleExchange = () => {
    if (!amount) {
      alert("Please enter a value");
      return;
    }

    alert(
      `Exchanging ${amount} ${sellCurrency} to ${buyCurrency}`
    );
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
            onChange={(e) => setSellCurrency(e.target.value)}
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
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
            onChange={(e) => setBuyCurrency(e.target.value)}
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
            23000 Eth
          </span>
        </div>
      </div>

      {/* Exchange button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={handleExchange}
          className="h-[40px] min-w-[112px] rounded-[8px] bg-[#2864dc] px-6 text-[10px] font-medium text-white shadow-md transition hover:bg-[#1f56c5]"
        >
          Exchange
        </button>
      </div>

    </div>
  );
}

export default ExchangeCoins;
