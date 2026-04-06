import { useState, useEffect, useRef } from "react";
import fs from "fs";
import path from "path";

// Extract movies.json at build time
export async function getStaticProps() {
  const moviesPath = path.join(process.cwd(), "public", "movies.json");
  let fileContents = "[]";
  try {
    fileContents = fs.readFileSync(moviesPath, "utf8");
  } catch(e) {
    console.error("movies.json not found", e);
  }
  const data = JSON.parse(fileContents);
  
  // Only send what's necessary to the frontend (id, title, index)
  const movies = data.map((movie, index) => ({
    title: movie.title,
    index: index
  }));

  return {
    props: {
      movies,
    },
  };
}

export default function Home({ movies }) {
  const [selectedIndex, setSelectedIndex] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMovies = movies
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectMovie = (movie) => {
    setSelectedIndex(movie.index);
    setSearchTerm(movie.title);
    setIsDropdownOpen(false);
    setError(null);
  };

  const handleRecommend = async () => {
    if (selectedIndex === "") {
      setError("Please select a movie first.");
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieIndex: parseInt(selectedIndex) }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>🎬 Cinematic Matches</h1>
      
      <div className="select-container">
        <div className="dropdown-wrapper" ref={wrapperRef}>
          <input
            type="text"
            className="search-input"
            placeholder="Search for a movie you liked..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
              setSelectedIndex(""); // Reset selected index if they change text
            }}
            onFocus={() => setIsDropdownOpen(true)}
          />
          {isDropdownOpen && (
            <ul className="dropdown-list">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((m) => (
                  <li
                    key={m.index}
                    className="dropdown-item"
                    onClick={() => handleSelectMovie(m)}
                  >
                    {m.title}
                  </li>
                ))
              ) : (
                <li className="dropdown-item" style={{ cursor: "default" }}>
                  No movies found
                </li>
              )}
            </ul>
          )}
        </div>

        {error && <p style={{color: '#ef4444', marginBottom: '15px'}}>{error}</p>}

        <button 
          onClick={handleRecommend} 
          className={loading ? "loading" : ""}
          disabled={loading}
        >
          {loading ? "Finding Recommendations..." : "Find Similar Movies"}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="recommendations">
          {recommendations.map((movie, i) => (
            <div className="movie-card" key={i}>
              <img
                src={movie.poster || "https://via.placeholder.com/500x750?text=No+Poster"}
                alt={movie.title}
                className="movie-poster"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/500x750?text=No+Poster";
                }}
              />
              <p className="movie-title">{movie.title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}