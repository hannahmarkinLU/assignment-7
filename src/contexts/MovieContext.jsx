import { createContext, useState, useContext, useEffect } from "react";

// Create the Context
const MovieContext = createContext();

// Custom hook to consume the context
export function useMovies() {
  const context = useContext(MovieContext);
  if (!context) {
    throw new Error("useMovies must be used within MovieProvider");
  }
  return context;
}

// Provider component
export function MovieProvider({ children }) {
  // Load initial watchlist from localStorage
  const [watchlist, setWatchlist] = useState(() => {
    const stored = localStorage.getItem("watchlist");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Add a movie to the watchlist (avoid duplicates)
  const addToWatchlist = (movie) => {
    if (!watchlist.some((m) => m.id === movie.id)) {
      setWatchlist((prev) => [...prev, movie]);
    }
  };

  // Remove a movie from the watchlist
  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  // Check if a movie is in the watchlist
  const isInWatchlist = (movieId) =>
    watchlist.some((movie) => movie.id === movieId);

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
}
