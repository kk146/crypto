import React from "react";
import CurrencyDropdown from "./CurrencyDropdown";

function Header({
  currency = "usd",
  setCurrency,
}) {
  const currencies = ["usd", "inr", "eur", "gbp"];

  return (
    <nav className="w-full bg-white px-6 py-4 border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center">
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          AI
        </span>

        <span className="ml-1 text-lg font-semibold text-gray-700">
          maBetter
        </span>
      </div>

      {/* Currency + Search */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex gap-4">
          {/* Currency Dropdown */}
          <CurrencyDropdown
            value={currency}
            currencies={currencies}
            onChange={setCurrency}
          />

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by coin"
            className="flex-1 h-10 px-20 border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </nav>
  );
}

export default Header;
