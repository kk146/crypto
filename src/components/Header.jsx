import logo from "../assets/almabetterlogo.png";
import { Search } from "lucide-react";

function Header({
  currency,
  setCurrency,
  search,
  setSearch,
}) {
  return (
    <header className="w-full bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Logo Row */}
      <div className="px-6 py-3">
        <img
          src={logo}
          alt="AlmaBetter Logo"
          className="h-10 object></div>

      {/* Currency + Search Row */}
      <div className="flex items-center gap-4 px-6 py-3" >

        {/* Currency Dropdown */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className=" h-10 w-24 px-3 rounded-lg  border border-gray-200 bg-white
    text-sm font-medium text-gray-700 outline-none cursor-pointer focus:border-blue-500" >
          
        
          <option value="usd">USD</option>
          <option value="inr">INR</option>
          <option value="eur">EUR</option>
          <option value="gbp">GBP</option>
        </select>

        {/* Search Box */}
        <div
          className="
            flex
            items-center
            gap-3
            flex-1
            h-10
            px-4
            rounded-lg
            border
            border-gray-200
            bg-white
            focus-within:border-blue-500
          "
        >
          <Search
            size={18}
            className="text-gray-400 flex-shrink-0"
          />

          <input
            type="text"
            placeholder="Search by coin..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              h-full
              bg-transparent
              text-sm
              text-gray-700
              outline-none
              placeholder:text-gray-400
            "
          />
        </div>
      </div>
    </header>
  );
}

export default Header;