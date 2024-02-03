import { useEffect, useState } from "react";
const KEY = "apikey=91beba17";
export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setISLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovie() {
        try {
          setISLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok) throw new Error("You are Offline");
          const data = await res.json();

          if (data.Response === "False") throw new Error("No Movie Found");
          setMovies(data.Search);
          setError("");
        } catch (err) {
          setError(err.message);
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setISLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }
      fetchMovie();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
