export default function ChartTypeDropdown({
  chartType,
  setChartType,
}) {
  return (
    <select
      value={chartType}
      onChange={(e) => setChartType(e.target.value)}
      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none"
    >
      <option value="line">Line Chart</option>
      <option value="bar">Bar Chart</option>
      <option value="bar-chart-horizontal">
        Horizontal Bar
      </option>
    </select>
  );
}
