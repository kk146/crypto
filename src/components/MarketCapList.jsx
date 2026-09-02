function MarketCapList() {
  const coins = [
    {
      name: "Bitcoin",
      cap: "$197,484",
      change: "+2.12%",
    },
    {
      name: "Ethereum",
      cap: "$145,320",
      change: "-1.45%",
    },
    {
      name: "Tether",
      cap: "$98,120",
      change: "+0.85%",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="font-bold mb-5">Market Cap</h2>

      {coins.map((coin) => (
        <div key={coin.name} className="flex justify-between py-3 border-b">
          <div>
            <p className="font-semibold">{coin.name}</p>

            <p className="text-gray-400 text-sm">{coin.cap}</p>
          </div>

          <span
            className={
              coin.change.startsWith("-") ? "text-red-500" : "text-green-500"
            }
          >
            {coin.change}
          </span>
        </div>
      ))}
    </div>
  );
}

export default MarketCapList;
