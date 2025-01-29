import React, { useState } from "react";
import GenreList from "./Components/GenreList";
import Auth from "./Components/Auth";
import Searcher from "./Components/Searcher";

function App() {
  const [token, setToken] = useState(localStorage.getItem("spotifyToken") || null);

  return (
    <div className="App">
      <h1 className="text-3xl font-bold underline color=red">Spotify Genre Explorer</h1>
      {token ? (
        <Searcher token={token} />
      ) : (
        <Auth setToken={setToken} />
      )}
    </div>
  );
}

export default App;