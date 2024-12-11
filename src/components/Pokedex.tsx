/* Importint React and Link from react-router-dom */
import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel } from "swiper/modules";

import "swiper/swiper-bundle.css";

/* Importing the CSS file */
import "../css/pokedex.css";

/* Importing the list of Pokémon */
import pokemonList from "../data/pokemons.json";

/* Importing the Footer component */
import Footer from "./Footer";
import PokemonCard from "./PokemonCard";

/**
 * Pokedex component that displays a list of Pokémon as links.
 * Each Pokémon name is converted to lowercase and used as the URL path.
 *
 * @component
 * @example
 * return (
 *   <Pokedex />
 * )
 */
const Pokedex: React.FC = () => {
  const [pokemonToShow, setPokemonToShow] = React.useState(pokemonList);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState("");

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterPokemon(query, selectedType);
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    setSelectedType(type);
    filterPokemon(searchQuery, type);
  };

  const filterPokemon = (query: string, type: string) => {
    const filteredPokemon = pokemonList.filter((pokemon) => {
      const matchesName = pokemon.name.english.toLowerCase().startsWith(query);
      const matchesType = type === "" ? true : pokemon.type.includes(type);
      return matchesName && matchesType;
    });
    setPokemonToShow(filteredPokemon);
  };

  return (
    <div id="pokedex">
      <div id="pokedex-navbar">
        <p>3D Pokedex</p>
        <search>
          <input
            type="text"
            placeholder="Search Pokémon"
            onInput={handleInput}
          />
          <select onChange={handleTypeChange}>
            <option value="">All Types</option>
            {Array.from(
              new Set(pokemonList.flatMap((pokemon) => pokemon.type))
            ).map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </search>
      </div>
      <div id="pokedex-container">
        <Swiper
          modules={[Navigation, Pagination, Mousewheel]}
          spaceBetween={30}
          slidesPerView="auto"
          centeredSlides={true}
          freeMode={true}
          mousewheel={{ forceToAxis: true }}
          navigation={true}
          initialSlide={2}
          cssMode
        >
          {pokemonToShow.map((pokemon, index) => (
            <SwiperSlide
              style={{
                width: "300px",
                textAlign: "center",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={index}
            >
              <PokemonCard
                key={index}
                name={pokemon.name.english}
                id={pokemon.id}
                types={pokemon.type}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <Footer />
    </div>
  );
};

export default Pokedex;
