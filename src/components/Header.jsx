import { Link } from "react-router-dom";
import { useState } from "react";

function Header({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHomeClick = () => {
    setSearchQuery("");
    onSearch(null);
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="app-title">
          MovieShelf
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link" onClick={handleHomeClick}>
            Home
          </Link>
          <Link to="/favorites" className="nav-link">
            Favorites
          </Link>
          <Link to="/watchlist" className="nav-link">
            Watchlist
          </Link>
        </nav>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
