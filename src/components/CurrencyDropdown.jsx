export default function CurrencyDropdown({
  value,
  currencies,
  onChange,
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-700 outline-none"
    >
      {currencies.map((currency) => (
        <option key={currency} value={currency}>
          {currency.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
