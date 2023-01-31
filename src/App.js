import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Gallery = () => {
  const [dogImages, setDogImages] = useState([]);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites")) || []
  );

  useEffect(() => {
    fetch('https://random.dog/woof.json')
      .then(res => res.json())
      .then(data => {
        setDogImages([data.url, ...dogImages].slice(0, 10));
      });
  }, []);

  const getRandomDogs = async () => {
    const response = await axios.get("https://random.dog/woof.json");
    setDogImages([...dogImages, response.data.url]);
  };

  const handleRefresh = () => {
    setDogImages([]);
    for (let i = 0; i < 6; i++) {
      getRandomDogs();
    }
  };

  const handleFavorite = (image) => {
    if (!favorites.includes(image)) {
      setFavorites([...favorites, image]);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {dogImages.map((image) => (
        <div key={image} style={{ width: "33.33%", padding: "10px" }}>
          <img
            src={image}
            alt="dog"
            style={{ width: "100%", height: "auto" }}
          />
          <button onClick={() => handleFavorite(image)}>Favorite</button>
        </div>
      ))}
      {dogImages.length === 0 && <p>Loading...</p>}
      {dogImages.length > 0 && (
        <button onClick={handleRefresh}>Refresh/Next</button>
      )}
    </div>
  );
};

const Favorites = () => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {favorites.map((image) => (
        <div key={image} style={{ width: "33.33%", padding: "10px" }}>
          <img
            src={image}
            alt="dog"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      ))}
      {favorites.length === 0 && <p>No favorites yet!</p>}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <h1>Dog Gallery</h1>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Gallery/>} />
          <Route path="/favorites" element={<Favorites/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
