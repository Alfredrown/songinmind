import React, { useState } from "react";
import GenreList from "./Components/GenreList";
import Auth from "./Components/Auth";
import Searcher from "./Components/Searcher";

function App() {
  // const [token, setToken] = useState(localStorage.getItem("spotifyToken") || null);

  return (
    <div className="App">
      <h1 className="text-3xl text-cyan-500">Song in Mind</h1>
     <Searcher/>
    </div>
  );
}

export default App;