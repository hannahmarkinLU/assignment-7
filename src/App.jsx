import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { searchMovies } from "./services/movieService";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import "./App.css";

function App() {
  // Create search state
  const [searchResults, setSearchResults] = useState(null);
  // Handler function to query search
  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults(null);
      return;
    }
    const results = await searchMovies(query);
    setSearchResults(results.results);
  };

  return (
    <Router>
      <div className="app">
        <Header onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home searchResults={searchResults} />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
