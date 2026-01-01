import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Watchlist from "./pages/Watchlist";
import { searchMovies } from "./services/movieService";
import { MovieProvider } from "./contexts/MovieContext";
import "./App.css";

const App = () => {
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    const results = await searchMovies(query);
    setSearchResults(results.results);
  };

  return (
    <MovieProvider>
      <Router>
        <div className="app">
          <Header onSearch={handleSearch} />
          <Routes>
            <Route path="/" element={<Home searchResults={searchResults} />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
        </div>
      </Router>
    </MovieProvider>
  );
};

export default App;
