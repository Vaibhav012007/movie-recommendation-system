import fs from "fs";
import path from "path";

let similarityData = null;
let moviesData = null;

// Helper to fetch TMDB poster
const fetchPoster = async (movie_id) => {
  const api_key = "36fea595f27a3438602044b484f71df9";
  try {
    const res = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`);
    const data = await res.json();
    return "https://image.tmdb.org/t/p/w500" + data.poster_path;
  } catch (error) {
    console.error("Fetch poster error:", error);
    return null;
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { movieIndex } = req.body;

  if (typeof movieIndex !== 'number') {
    return res.status(400).json({ message: "Invalid movie index" });
  }

  try {
    if (!similarityData) {
      console.log("Loading similarity.json into memory...");
      const simPath = path.join(process.cwd(), "public", "similarity.json");
      similarityData = JSON.parse(fs.readFileSync(simPath, "utf8"));
    }
    
    if (!moviesData) {
      console.log("Loading movies.json into memory...");
      const moviesPath = path.join(process.cwd(), "public", "movies.json");
      moviesData = JSON.parse(fs.readFileSync(moviesPath, "utf8"));
    }

    const simRow = similarityData[movieIndex];
    if (!simRow) {
      return res.status(404).json({ message: "Movie data not found" });
    }

    const distances = simRow
      .map((sim, i) => [i, sim])
      .sort((a, b) => b[1] - a[1])
      .slice(1, 6); // Skip the first one since it's the movie itself

    let recommendations = [];
    
    for (let i of distances) {
      const movie = moviesData[i[0]];
      const poster = await fetchPoster(movie.id);
      
      recommendations.push({
        title: movie.title,
        poster: poster,
        id: movie.id
      });
    }

    res.status(200).json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
