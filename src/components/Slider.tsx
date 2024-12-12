/**
 * Importing React and the slider CSS.
 */
import React from "react";
import { useParams } from "react-router-dom";
import "../css/slider.css";

import arrowRight from "../assets/pokedex/pokedexArrowRight.png";
import arrowLeft from "../assets/pokedex/pokedexArrowLeft.png";

/**
 * Props for the Slider component.
 */
interface SliderProps {
  direction: "left" | "right";
}

/**
 * Slider component that displays a left or right arrow to navigate between Pokémon.
 * Uses the URL parameter to determine the current Pokémon ID.
 */
const Slider: React.FC<SliderProps> = ({ direction }) => {
  const { pokemonId } = useParams<{ pokemonId: string }>();

  const handleClick = () => {
    const newId =
      direction === "left"
        ? parseInt(pokemonId || "0") - 1
        : parseInt(pokemonId || "0") + 1;
    window.location.href = `/${newId}`;
  };

  return (
    <div
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      id="slider"
      className={`slider-${direction}`}
    >
      <img src={direction === "left" ? arrowLeft : arrowRight} alt={`${direction} arrow`} />
    </div>
  );
};

export default Slider;
