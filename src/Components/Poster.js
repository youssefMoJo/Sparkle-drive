import React from "react";
import "../Styles/Poster.css";

function Poster() {
  return (
    <div className="Poster">
      <img
        className="PosterImg"
        src={require("../Assets/poster.jpg")}
        alt="poster"
      />
    </div>
  );
}

export default Poster;
