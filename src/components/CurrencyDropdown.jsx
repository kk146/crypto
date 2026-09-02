export default function CurrencyDropdown({ value, currencies, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 border rounded-lg bg-white"
    >
      {currencies.map((coin) => (
        <option key={coin} value={coin}>
          {coin}
        </option>
      ))}
    </select>
  );
}
