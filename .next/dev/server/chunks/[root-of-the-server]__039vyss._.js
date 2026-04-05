module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/pages/api/recommend.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
let similarityData = null;
let moviesData = null;
// Helper to fetch TMDB poster
const fetchPoster = async (movie_id)=>{
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
async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method not allowed"
        });
    }
    const { movieIndex } = req.body;
    if (typeof movieIndex !== 'number') {
        return res.status(400).json({
            message: "Invalid movie index"
        });
    }
    try {
        if (!similarityData) {
            console.log("Loading similarity.json into memory...");
            const simPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "similarity.json");
            similarityData = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(simPath, "utf8"));
        }
        if (!moviesData) {
            console.log("Loading movies.json into memory...");
            const moviesPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "public", "movies.json");
            moviesData = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(moviesPath, "utf8"));
        }
        const simRow = similarityData[movieIndex];
        if (!simRow) {
            return res.status(404).json({
                message: "Movie data not found"
            });
        }
        const distances = simRow.map((sim, i)=>[
                i,
                sim
            ]).sort((a, b)=>b[1] - a[1]).slice(1, 6); // Skip the first one since it's the movie itself
        let recommendations = [];
        for (let i of distances){
            const movie = moviesData[i[0]];
            const poster = await fetchPoster(movie.id);
            recommendations.push({
                title: movie.title,
                poster: poster,
                id: movie.id
            });
        }
        res.status(200).json({
            recommendations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__039vyss._.js.map