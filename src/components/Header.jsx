import MarketCapList from "./MarketCapList";

function Header({
  currency,
  setCurrency,
  search,
  setSearch,
}) {
  return (
    <>
      <nav className="w-full bg-white px-6 py-4 border-b border-gray-200">
        <div className="flex items-center">
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            AI
          </span>
          <span className="ml-1 text-lg font-semibold text-gray-700">
            maBetter
          </span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-6 px-4">
        <div className="flex items-start gap-4">
          
          {/* Left Section */}
          <div className="flex-1">
            <div className="flex gap-4">
              
              {/* Currency Dropdown */}
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-10 px-3 border border-gray-300 rounded-md bg-white"
              >
                <option value="USD">USD</option>
                <option value="INR">INR</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>

              {/* Search Bar */}
              <input
                type="text"
                placeholder="Search by coin"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-10 px-20 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="w-72">
            <MarketCapList />
          </aside>
          
        </div>
      </div>
    </>
  );
}

export default Header;
