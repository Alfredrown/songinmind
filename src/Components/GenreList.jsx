import axios from "axios";
import React, { useState, useEffect } from "react";

function GenreList({ token }) {
  const [genres, setGenres] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGenres = async () => {
      const url = "https://api.spotify.com/v1/recommendations/available-genre-seeds";
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        setGenres(response.data.genres); // Update genres state
      } catch (err) {
        console.error("Error fetching genres:", err);
        setError("Failed to load genres. Please try again.");
      }
    };

    if (token) {
      fetchGenres();
    }
  }, [token]);

  return (
    <div>
      <h1>Available Genres</h1>
      {error ? (
        <p>{error}</p>
      ) : genres.length > 0 ? (
        <ul>
          {genres.map((genre, index) => (
            <li key={index}>{genre}</li>
          ))}
        </ul>
      ) : (
        <p>Loading genres...</p>
      )}
    </div>
  );
}

export default GenreList;
