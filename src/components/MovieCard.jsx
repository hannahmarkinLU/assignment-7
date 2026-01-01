import { useEffect, useState } from "react";
import { useMovies } from "../contexts/MovieContext";
import { useLocation } from "react-router-dom";

function MovieCard({ movie }) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useMovies();
  const [isFavorite, setIsFavorite] = useState(false);
  const inWatchlist = isInWatchlist(movie.id);

  const location = useLocation();

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://placehold.co/300x450?text=No+Image";

  // Favorites logic
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some((fav) => fav.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (isFavorite) {
      const updated = favorites.filter((fav) => fav.id !== movie.id);
      localStorage.setItem("favorites", JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
    }
  };

  const handleWatchlistClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  // Change text to "remove from watchlist" if on watchlist page
  const getWatchlistText = () => {
    if (location.pathname === "/watchlist") return "✖ Remove from Watchlist";
    return inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist";
  };

  // Determine button CSS class
  const getWatchlistClass = () => {
    if (location.pathname === "/watchlist") return "watchlist-button remove";
    return `watchlist-button ${inWatchlist ? "added" : ""}`;
  };

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={posterUrl} alt={movie.title} />
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>

        <div className="movie-details">
          <span className="movie-rating">⭐ {movie.vote_average}</span>
          <span className="movie-year">
            {movie.release_date?.substring(0, 4)}
          </span>
        </div>

        {/* Favorites button */}
        <button
          className={`favorite-button ${isFavorite ? "favorited" : ""}`}
          onClick={toggleFavorite}
        >
          {isFavorite ? "♥ Remove from Favorites" : "♡ Add to Favorites"}
        </button>

        {/* Watchlist button */}
        <button className={getWatchlistClass()} onClick={handleWatchlistClick}>
          {getWatchlistText()}
        </button>
      </div>
    </div>
  );
}

export default MovieCard;
