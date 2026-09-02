import Header from "../components/Header";
import ChartSection from "../components/ChartSection";
import Portfolio from "../components/Portfolio";
import ExchangeCoins from "../components/ExchangeCoins";
import MarketCapList from "../components/MarketCapList";

function Dashboard() {
  return (
    <div className="bg-slate-100 min-h-screen p-6">
      {/* HEADER */}
      <div className="mb-4">
        <Header />
      </div>

      {/* MAIN DASHBOARD */}
      <div className="grid grid-cols-12 gap-4">
        {/* LEFT SIDE */}
        <div className="col-span-9">
          {/* CRYPTO GRAPH */}
          <ChartSection />

          {/* PORTFOLIO + EXCHANGE */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <Portfolio />
            <ExchangeCoins />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-3">
          <MarketCapList />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
