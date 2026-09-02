import { useState } from "react";
import Header from "./components/Header";
import ChartControls from "./components/ChartControls";
import PriceChart from "./components/PriceChart";
import Portfolio from "./components/Portfolio";
import MarketCapList from "./components/MarketCapList";
import ExchangeCard from "./components/ExchangeCard";
import "./App.css";

function App() {
  const [chartType, setChartType] = useState("line");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-9">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <ChartControls chartType={chartType} setChartType={setChartType} />

            <PriceChart chartType={chartType} />
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <Portfolio />
            <ExchangeCard />
          </div>
        </div>

        <div className="col-span-3">
          <MarketCapList />
        </div>
      </div>
    </div>
  );
}

export default App;
