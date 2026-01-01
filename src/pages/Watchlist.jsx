import MovieGrid from "../components/MovieGrid";
// 1. Import the custom hook to use the Movie context
import { useMovies } from "../contexts/MovieContext";

function Watchlist() {
  // 2. Use the custom hook to access the watchlist from context
  const { watchlist } = useMovies();

  return (
    <main className="main-content">
      <div className="content-header">
        <h2>My Watchlist</h2>
      </div>

      {/* 3. Pass the watchlist to MovieGrid */}
      {watchlist.length > 0 ? (
        <MovieGrid movies={watchlist} />
      ) : (
        <div className="empty-state">
          <p>
            No movies in your watchlist yet. Start adding some from the home
            page!
          </p>
        </div>
      )}
    </main>
  );
}

export default Watchlist;
