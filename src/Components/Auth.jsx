import React, { useEffect } from "react";

function Auth({ setToken }) {
  const handleSpotifyCallback = () => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove #
      const token = params.get("access_token");
      if (token) {
        setToken(token);
        localStorage.setItem("spotifyToken", token); // Store token
        window.location.hash = ""; // Clean URL
      }
    }
  };

  useEffect(() => {
    handleSpotifyCallback();
  }, []);

  const LoginButton = () => {
    const client_id = process.env.SPOTIFYID; // Ensure you have an env variable
    const scope = "playlist-modify-private";
    const redirect_uri = "http://localhost:3000";

    let spotify_url = "https://accounts.spotify.com/authorize";
    spotify_url += "?response_type=token";
    spotify_url += "&client_id=" + encodeURIComponent(client_id);
    spotify_url += "&scope=" + encodeURIComponent(scope);
    spotify_url += "&redirect_uri=" + encodeURIComponent(redirect_uri);

    return (
      <a
        href={spotify_url}
        className="bg-spotify_main hover:bg-gray-600 w-60 rounded-full text-white font-medium px-1 py-1 flex cursor-pointer justify-center align-middle"
      >
        LOG IN WITH SPOTIFY
      </a>
    );
  };

  return (
    <div className="bg-dark_main min-h-screen">
      <LoginButton />
    </div>
  );
}

export default Auth;
