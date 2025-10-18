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

  // Fetch autocomplete suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length === 0) {
        setSuggestions([]);
        return;
      }

      try {
        const suggestResults = await client
          .collections("products")
          .documents()
          .search({
            q: query,
            query_by: "name",
            per_page: 5,
            drop_tokens_threshold: 2,
            prefix: true, // Enables autocomplete-style matching
            num_typos: 2,
          });

        setSuggestions(suggestResults.hits.map((hit) => hit.document.name));
      } catch (error) {
        console.error("Autocomplete fetch failed:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 200); // debounce typing
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const searchResults = await client
        .collections("products")
        .documents()
        .search({
          q: query,
          query_by: "name,description",
          highlight_full_fields: "name,description",
          num_typos: 2,
          typo_tokens_threshold: 3,
        });

      setResults(searchResults.hits);
      setSuggestions([]); // Clear suggestions on search
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#1a0029] to-[#140014] text-white flex flex-col items-center p-6 relative overflow-hidden">
      {/* Animated Glow */}
      <div className="absolute w-[400px] h-[400px] bg-purple-600/30 rounded-full blur-[200px] top-20 left-1/2 -translate-x-1/2 animate-pulse" />

      {/* Logo + Heading */}
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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent animate-text-glow">
          Bytemonk Semantic Search
        </h1>
        <p className="text-gray-400 mt-2 text-center max-w-lg">
          Super-fast, typo-tolerant search powered by <span className="text-purple-400 font-semibold">Typesense</span>.<br />
          Future-ready with LLMs and vector embeddings.
        </p>
      </motion.div>

      {/* Search Bar + Autocomplete */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="my-10 w-full max-w-lg flex flex-col gap-2 z-10 relative"
      >
        <div className="relative w-full">
          <Input
            type="text"
            placeholder="Search anything... (Try typos or partial names)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-5 rounded-2xl bg-[#120020]/70 text-white border border-purple-700/40 focus:border-purple-500 placeholder-gray-400 shadow-lg shadow-purple-900/20"
          />
          <Search className="absolute cursor-pointer right-3 top-2 text-purple-400" size={22} />

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute z-20 mt-2 w-full bg-[#1b0030]/95 border border-purple-800/30 rounded-xl shadow-lg max-h-60 overflow-y-auto backdrop-blur-md">
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
            No results found. Try searching for "ByteBook" or "Drone".
          </p>
        ) : (
          results.map((hit, i) => {
            const r = hit.document;
            return (
              <motion.div key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Card className="bg-gradient-to-br from-[#1b0030] via-[#24003b] to-[#160028] border border-purple-700/40 shadow-lg shadow-purple-900/40 rounded-2xl overflow-hidden hover:shadow-purple-500/40 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Highlighted Product Name */}
                    <h2
                      className="text-2xl font-semibold text-purple-300 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: hit.highlight?.name?.snippet || r.name,
                      }}
                    />

                    {/* Description */}
                    <p className="text-gray-400 text-sm mb-3">
                      {r.description}
                    </p>

                    {/* Price */}
                    <div className="text-purple-400 font-semibold text-lg">
                      ${r.price.toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </motion.div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-500 text-sm text-center z-10">
        ⚡ Powered by <span className="text-purple-400">Typesense</span> | Built with ❤️ by <span className="text-pink-400">Bytemonk</span>
      </footer>
    </main>
  );
}