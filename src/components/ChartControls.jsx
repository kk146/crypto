function ChartControls({ chartType, setChartType }) {
  return (
    <div className="flex justify-between items-center mb-5">
      <div className="flex gap-2">
        {["1D", "1W", "1M", "6M", "1Y"].map((item) => (
          <button key={item} className="px-3 py-1 border rounded-lg">
            {item}
          </button>
        ))}
      </div>

      <select
        value={chartType}
        onChange={(e) => setChartType(e.target.value)}
        className="border rounded-lg px-3 py-2"
      >
        <option value="line">Line Chart</option>
        <option value="bar">Bar Chart</option>
      </select>
    </div>
  );
}

export default ChartControls;
