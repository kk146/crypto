function ExchangeCard() {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="font-bold mb-4">Exchange Coins</h2>

      <div className="space-y-4">
        <select className="w-full border p-3 rounded-lg">
          <option>Bitcoin</option>
          <option>Ethereum</option>
        </select>

        <select className="w-full border p-3 rounded-lg">
          <option>Ethereum</option>
          <option>Bitcoin</option>
        </select>

        <button className="w-full bg-blue-500 text-white py-3 rounded-lg">
          Exchange
        </button>
      </div>
    </div>
  );
}

export default ExchangeCard;
