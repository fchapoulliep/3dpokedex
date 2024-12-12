/* Importing React and Link from react-router-dom */
import React from "react";

/* Importing Swiper components */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Keyboard } from "swiper/modules";
import SwiperCore from "swiper/core";
SwiperCore.use([Keyboard, Navigation]);
import "swiper/swiper-bundle.css";

/* Importing the CSS file */
import "../css/pokedex.css";

/* Importing the list of Pokémon */
import pokemonList from "../data/pokemons.json";

/* Importing the Footer component */
import Footer from "./Footer";
import PokemonCard from "./PokemonCard";

import pokemonLogo from "../assets/logo/pokemonLogo.png";


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

  /**
   * handleInput function that filters the Pokémon list based on the search query.
   */
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    filterPokemon(query, selectedType);
  };

  /**
   * handleTypeChange function that filters the Pokémon list based on the selected type.
   */
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const type = event.target.value;
    setSelectedType(type);
    filterPokemon(searchQuery, type);
  };

  /**
   * filterPokemon function that filters the Pokémon list based on the search query and type.
   * @param query the search query
   * @param type the selected type
   */
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
        <a
          href={`${import.meta.env.BASE_URL}`}
          style={{ height: "100%", display: "flex", alignItems: "center" }}
        >
          <img
            src={pokemonLogo}
            alt="Pokemon Logo"
            style={{ width: "100px" }}
          />
        </a>
        <search id="search-bar">
          <input
            name="pokemon-name"
            type="text"
            placeholder="Search Pokémon"
            onInput={handleInput}
          />
          <select name="pokemon-type" onChange={handleTypeChange}>
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
          spaceBetween={30}
          slidesPerView="auto"
          centeredSlides={true}
          freeMode={true}
          navigation={true}
          initialSlide={2}
          keyboard
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
