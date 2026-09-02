export default function ChartTypeDropdown({ chartType, setChartType }) {
  return (
    <select
      value={chartType}
      onChange={(e) => setChartType(e.target.value)}
      className="px-4 py-2 border rounded-lg bg-white"
    >
      <option value="line">Line Chart</option>
      <option value="bar">Bar Chart</option>
    </select>
  );
}
