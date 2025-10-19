"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import client from "@/lib/typesenseClient";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Autocomplete Suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        return;
      }
      try {
        const suggestResults = await client
          .collections("books")
          .documents()
          .search({
            q: query,
            query_by: "title,authors",
            per_page: 5,
            prefix: true,
            num_typos: 2,
          });
        setSuggestions(suggestResults.hits.map((hit) => hit.document.title));
      } catch (error) {
        console.error("Autocomplete fetch failed:", error);
      }
    };
    const debounce = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(debounce);
  }, [query]);

  // Hybrid Search enabled
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch("http://localhost:8108/multi_search", {
        method: "POST",
        headers: {
          "X-TYPESENSE-API-KEY": "5DcmJ1K7mR2zRh26Ept9J2ttSfH0uUOvfMHc0jSVmXR0W9ce",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searches: [
            {
              q: query,
              collection: "books",
              query_by: "title,authors,embedding",
              exclude_fields: "embedding",
              rerank_hybrid_matches: true,
              vector_query: "embedding:([], alpha: 0.8)", // best combination : 80% keyword + 20% semantic
              per_page: 15,
            },
          ],
        }),
      });

      const data = await response.json();
      const searchResults = data.results?.[0] || { hits: [] };
      setResults(searchResults.hits);
      setSuggestions([]);
    } catch (error) {
      console.error("Hybrid Search failed:", error);
    }
  };

  const handleSuggestionClick = (s) => {
    setQuery(s);
    setSuggestions([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a0029] to-[#140014] text-white flex flex-col items-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[200px] top-20 left-1/2 -translate-x-1/2 animate-pulse" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center z-10"
      >
        <img
          src="/Bytemonk_logo.jpg"
          alt="Bytemonk Logo"
          className="w-24 h-24 rounded-full mb-4 drop-shadow-[0_0_25px_rgba(255,0,255,0.7)]"
        />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-text-glow py-2">
          Bytemonk Search Engine
        </h1>
        <p className="text-gray-400 mt-2 text-center max-w-lg">
          Powered by{" "}
          <span className="text-purple-400 font-semibold">Typesense</span> — combining{" "}
          <span className="text-pink-400 font-semibold">Future-ready with LLMs and vector embeddings.</span> and{" "}
          <span className="text-purple-400 font-semibold">keyword accuracy</span>.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="my-10 w-full max-w-lg flex flex-col gap-3 z-10 relative"
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search books or authors..."
            value={query}
            onKeyDown={(e) => {
            if (e.key === "Enter") {
                setSuggestions([]);
              }
            }}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-5 rounded-2xl bg-[#120020]/70 text-white border border-purple-700/40 focus:border-purple-500 placeholder-gray-400 shadow-lg shadow-purple-900/20"
          />
          <Search
            className="absolute cursor-pointer right-3 top-2 text-purple-400"
            size={22}
            onClick={handleSearch}
          />

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-[1000] mt-2 w-full bg-[#1b0030]/95 border border-purple-800/30 rounded-xl shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="px-4 py-3 cursor-pointer text-gray-200 hover:bg-purple-800/30 transition-colors duration-200"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.form>

      {/* Results */}
      <motion.div
        className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {results.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">
            No results found. Try searching for "Harry Potter" or "The Hobbit".
          </p>
        ) : (
          results.map((hit, i) => {
            const r = hit.document;
            return (
              <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Card className="bg-gradient-to-br from-[#1b0030] via-[#24003b] to-[#160028] border border-purple-700/40 shadow-lg shadow-purple-900/40 rounded-2xl overflow-hidden hover:shadow-purple-500/40 transition-all duration-300">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    {r.image_url && (
                      <img
                        src={r.image_url}
                        alt={r.title}
                        className="w-32 h-48 object-cover rounded-xl mb-4 shadow-md shadow-purple-900/30"
                      />
                    )}

                    <h2
                      className="text-2xl font-semibold text-purple-300 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: hit.highlight?.title?.snippet || r.title,
                      }}
                    />
                    <p className="text-gray-400 text-sm mb-3 italic">
                      {Array.isArray(r.authors) ? r.authors.join(", ") : r.authors}
                    </p>
                    <div className="text-sm text-gray-500 mb-2">
                      📘 {r.publication_year} • ⭐ {r.average_rating.toFixed(2)} (
                      {r.ratings_count.toLocaleString()} ratings)
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>

      <footer className="mt-auto py-6 text-gray-500 text-sm text-center z-10">
        ⚡ Powered by <span className="text-purple-400">Typesense</span> |
        Built with ❤️ by <span className="text-pink-400">Bytemonk</span>
      </footer>
    </main>
  );
}
