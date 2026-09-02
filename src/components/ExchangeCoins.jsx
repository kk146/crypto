import { useState } from "react";

function ExchangeCoins() {
  const [amount, setAmount] = useState("");

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm h-[300px]">
      <h2 className="font-bold text-lg mb-5">Exchange Coins</h2>

      <div className="space-y-4">
        <select className="w-full border rounded-lg p-3">
          <option>Bitcoin (BTC)</option>
          <option>Ethereum (ETH)</option>
          <option>Solana (SOL)</option>
        </select>

        <select className="w-full border rounded-lg p-3">
          <option>Ethereum (ETH)</option>
          <option>Bitcoin (BTC)</option>
          <option>BNB</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter Amount"
          className="w-full border rounded-lg p-3"
        />

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          Exchange
        </button>
      </div>
    </div>
  );
}

export default ExchangeCoins;
