import React from "react";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        style={{ color: i <= rating ? "gold" : "lightgrey", fontSize: "1.2em" }}
      >
        &#9733;
      </span>
    );
  }
  return <div><p>Valoración: {stars}</p></div>;
};

export default StarRating;
