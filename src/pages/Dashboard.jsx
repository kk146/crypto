import Header from "../components/Header";
import ChartSection from "../components/ChartSection";
import Portfolio from "../components/Portfolio";
import ExchangeCard from "../components/ExchangeCard";
import MarketCapList from "../components/MarketCapList";
import { useState } from "react";

function Dashboard() {
  const [currency, setCurrency] = useState("usd");

  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* HEADER */}
      <div className="mb-4">
        <Header
          currency={currency}
          setCurrency={setCurrency}
        />
      </div>

      {/* MAIN DASHBOARD */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT SIDE */}
        <div className="col-span-9">
          {/* CRYPTO GRAPH */}
          <ChartSection currency={currency} />

          {/* PORTFOLIO + EXCHANGE */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Portfolio />
            <ExchangeCard />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3">
          <MarketCapList currency={currency} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
