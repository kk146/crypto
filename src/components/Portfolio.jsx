import { Pie } from "react-chartjs-2";
import { ArcElement, Chart as ChartJS, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Portfolio() {
  const data = {
    labels: ["Bitcoin", "Ethereum", "Tether"],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"],
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm">
      <h2 className="font-bold mb-4">Portfolio</h2>

      <Pie data={data} />
    </div>
  );
}

export default Portfolio;
