import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import './App.css';

interface Movie {
  id: string;
  title: string;
  genres: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string;
}

const genres = [
  { genre: 'Action', movie_count: 715 },
  { genre: 'Adventure', movie_count: 598 },
  { genre: 'Animation', movie_count: 200 },
  { genre: 'Comedy', movie_count: 650 },
  { genre: 'Crime', movie_count: 322 },
  { genre: 'Documentary', movie_count: 1 },
  { genre: 'Drama', movie_count: 762 },
  { genre: 'Family', movie_count: 303 },
  { genre: 'Fantasy', movie_count: 349 },
  { genre: 'History', movie_count: 89 },
  { genre: 'Horror', movie_count: 255 },
  { genre: 'Music', movie_count: 45 },
  { genre: 'Mystery', movie_count: 198 },
  { genre: 'Romance', movie_count: 297 },
  { genre: 'Science Fiction', movie_count: 381 },
  { genre: 'TV Movie', movie_count: 6 },
  { genre: 'Thriller', movie_count: 588 },
  { genre: 'War', movie_count: 70 },
  { genre: 'Western', movie_count: 24 },
];

function App() {
  const [selectedGenres, setSelectedGenres] = useState(['']);
  const [matchType, setMatchType] = useState('Contains');
  const [Movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Disabling other Genre when selecting more than 5
  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre);
      } else {
        if (prev.length < 5) {
          return [...prev, genre];
        } else {
          return prev;
        }
      }
    });
  };

  // Filtering Genre selection for Genre that has less than 10 movies
  const isGenreDisabled = (genre: string): boolean => {
    const isSpecialGenre = genre === 'Documentary' || genre === 'TV Movie';
    const hasDocumentary = selectedGenres.includes('Documentary');
    const hasTVMovie = selectedGenres.includes('TV Movie');
    if (
      (hasDocumentary && genre === 'TV Movie') ||
      (hasTVMovie && genre === 'Documentary')
    ) {
      return true;
    }
    if ((hasDocumentary || hasTVMovie) && !isSpecialGenre) {
      return true;
    }
    if (
      !hasDocumentary &&
      !hasTVMovie &&
      selectedGenres.length >= 1 &&
      isSpecialGenre
    ) {
      return true;
    }
    return false;
  };

  // Get Filtered Movie
  const handleGetMovies = async () => {
    const genreQuery = selectedGenres
      .map((genre) => genre.toLowerCase())
      .join('%2C');
    const url = `https://movie-recommendation-backend-api-ktyjfgxdka-as.a.run.app/get_movies?genre=${genreQuery}&match_type=${matchType.toLowerCase()}`;
    setIsLoading(true);
    try {
      const response = await fetch(url);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get Random Movie
  const handleGetRandom = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://movie-recommendation-backend-api-ktyjfgxdka-as.a.run.app/random'
      );
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const extractYear = (releaseDate: string) => {
    return releaseDate.split('-')[0]; // Extract the year (e.g., "2007")
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://fastapi.tiangolo.com/" target="_blank">
          <img
            src="https://cdn.worldvectorlogo.com/logos/fastapi.svg"
            className="logo fastapi"
            alt="FastAPI logo"
          />
        </a>
      </div>

      <h1>Movie Recommendation</h1>

      <div className="genre-checklist">
        <h2>Select Genres (1 - 5)</h2>
        <ul>
          {genres.map((genre, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  value={genre.genre}
                  onChange={() => handleGenreChange(genre.genre)}
                  checked={selectedGenres.includes(genre.genre)}
                  disabled={
                    isGenreDisabled(genre.genre) ||
                    (selectedGenres.length >= 5 &&
                      !selectedGenres.includes(genre.genre))
                  }
                />
                {genre.genre} ({genre.movie_count})
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="match-type">
        <h2>Select Match Type</h2>
        <select
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
        >
          <option value="contains">Contains</option>
          <option value="exact">Exact</option>
        </select>
      </div>

      <div className="card">
        <button onClick={handleGetMovies} disabled={selectedGenres.length < 1}>
          Get Movies
        </button>
        <button onClick={handleGetRandom}>Get Random</button>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div> {/* This is the loading spinner */}
        </div>
      )}

      {Movies.length > 0 && !isLoading && (
        <div className="movie-list">
          <h2>Movie List</h2>
          <div className="movie-grid">
            {Movies.map((movie) => (
              <div key={movie.id} className="movie-item">
                <img
                  src={`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <h3>
                    {movie.title} ({extractYear(movie.release_date)})
                  </h3>
                  <p>{movie.genres}</p>
                  <p>
                    <strong>{movie.vote_average.toFixed(1)}</strong> (
                    {movie.vote_count} Voters)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="credit">
        Built by{' '}
        <a
          href="https://github.com/gnrkfz"
          target="_blank"
          rel="noopener noreferrer"
        >
          GNRKFZ
        </a>
      </p>
    </>
  );
}

export default App;
