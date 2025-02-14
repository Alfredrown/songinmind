import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

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
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });

      const prompt = `Analyze the following text and suggest 1 song that best match the mood or emotion. Only show the song title and artist.
      Given the text: "${text}"`;
      console.log("debug:", prompt);

      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      console.log(response);

      
      // YouTube Data API call
      const youtubeResponse = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            q: response, // Hasil dari Gemini AI
            part: "snippet",
            type: "video",
            maxResults: 1,
            key: process.env.YOUTUBE_API_KEY,
            regionCode: "US", // Bisa diubah sesuai target audiens
            videoDuration: "any",
          },
        }
      );
      console.log("YouTube API Response:", youtubeResponse.data);

      const videos = youtubeResponse.data.items;

      if (videos.length > 0) {
        const video = videos[0];
        if (video.snippet) {
          const title = video.snippet.title;
          console.log("Video title:", title); // Debugging
          setOutput(
            <div>
              <h3>{title}</h3>
              <img src={video.snippet.thumbnails.default.url} alt={title} />
              <p>{video.snippet.description}</p>
              <a href={`http://www.youtube.com/watch?v=${video.id.videoId}`} target="_blank" rel="noopener noreferrer">
                Watch on YouTube
              </a>
            </div>
          );
        } else {
          console.error("Video snippet is undefined", video);
          setOutput("No valid video found.");
        }
      } else {
        setOutput("No videos found.");
      }

    } catch (error) {
      console.error("YouTube API Error:", error.response?.data || error.message);
      setOutput("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


 

  return (
    <div>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="How are you feeling today?"
        className="input-field"
      ></textarea>
      <button onClick={generateText} disabled={loading}>
        {loading ? "Loading..." : "Get Video"}
      </button>
      <h2>Output:</h2>
      <p>{output}</p>
    </div>
  );
}

export default Searcher;