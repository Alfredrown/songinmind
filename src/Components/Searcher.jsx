import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import genreData from "./genres_dict.json"; // Import the genre.json file

function Searcher({ token }) {
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const generateText = async () => {
    if (text === "") {
      alert("Please enter some text");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY); 
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Analyze the following text and suggest a list of music genres that best match the mood or emotion. Return only the genres as a comma-separated list:
      Text: "${text}"
      Suggested Genres:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const suggestedGenres = response.text().trim().toLowerCase();

      const genresList = suggestedGenres.split(",").map((genre) => genre.trim());

      const matchedGenres = [];
      for (const genre of genresList) {
        if (genreData.genres.map((g) => g.toLowerCase()).includes(genre)) {
          matchedGenres.push(genre);
        }
        else if (genreData.subgenres.map((g) => g.toLowerCase()).includes(genre)) {
          matchedGenres.push(genre);
        }
      }

      if (matchedGenres.length === 0) {
        setOutput("No matching genres found. Please try again.");
        return;
      }

      // Fetch recommended tracks based on matched genres using Spotify Recommendations API
      const seedGenres = matchedGenres.slice(0, 5).join(","); // Use up to 5 genres as seeds
      console.log("Seed Genres:", seedGenres); // Debugging

      const spotifyResponse = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=50&market=US`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const tracks = spotifyResponse.data.tracks;
      if (tracks.length === 0) {
        setOutput("No songs found for these genres. Please try again.");
        return;
      }

      // Select a random song from the recommended tracks
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      setOutput(
        `Recommended Song: ${randomTrack.name} by ${randomTrack.artists[0].name}`
      );
    } catch (error) {
      console.error("Error generating text:", error.response?.data || error.message);
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Song in Mind</h1>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="How are you feeling today?"
        className="input-field"
      ></textarea>
      <button onClick={generateText} disabled={loading}>
        {loading ? "Loading..." : "Get Song"}
      </button>
      <h2>Output:</h2>
      <p>{output}</p>
    </div>
  );
}

export default Searcher;