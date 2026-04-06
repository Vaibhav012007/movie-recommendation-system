import fs from "fs";
import path from "path";

let recData = null;
let moviesData = null;
let posterCache = {}; // 🔥 cache posters

// 🔥 Improved fetchPoster (timeout + retry + cache)
const fetchPoster = async (movie_id) => {
  const api_key = "36fea595f27a3438602044b484f71df9";

  // ✅ Return cached if available
  if (posterCache[movie_id]) return posterCache[movie_id];

  const url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}`;

  const tryFetch = async () => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) return null;

      const data = await res.json();

      if (!data.poster_path) return null;

      return "https://image.tmdb.org/t/p/w500" + data.poster_path;

    } catch {
      return null;
    }
  };

  // 🔁 Retry once
  let poster = await tryFetch();
  if (!poster) poster = await tryFetch();

  // ✅ Save in cache (even null to avoid repeat calls)
  posterCache[movie_id] = poster;

  return poster;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { movieIndex } = req.body;

  if (typeof movieIndex !== "number") {
    return res.status(400).json({ message: "Invalid movie index" });
  }

  try {
    // Load once
    if (!recData) {
      const recPath = path.join(process.cwd(), "public", "recommendations.json");
      recData = JSON.parse(fs.readFileSync(recPath, "utf8"));
    }

    if (!moviesData) {
      const moviesPath = path.join(process.cwd(), "public", "movies.json");
      moviesData = JSON.parse(fs.readFileSync(moviesPath, "utf8"));
    }

    const indices = recData[movieIndex];

    if (!indices || !Array.isArray(indices)) {
      return res.status(404).json({ message: "No recommendations found" });
    }

    // ⚡ Parallel fetch
    const recommendations = [];

    const BATCH_SIZE = 5; // 🔥 control concurrency

    for (let i = 0; i < indices.length; i += BATCH_SIZE) {
      const batch = indices.slice(i, i + BATCH_SIZE);

      const results = await Promise.all(
        batch.map(async (idx) => {
          const movie = moviesData[idx];

          if (!movie) {
            return { title: "Unknown", poster: null, id: null };
          }

          const poster = await fetchPoster(movie.id);

          return {
            title: movie.title,
            poster,
            id: movie.id,
          };
        })
      );

  recommendations.push(...results);
}

    res.status(200).json({ recommendations });

  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}