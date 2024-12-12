/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.scss";

/**
 * Loader component that displays a loading animation.
 * 
 * This component includes:
 * - A Pokeball animation.
 * 
 * @component
 * @example
 * return (
 *   <Loader />
 * )
 */
const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="o-pokeball c-loader u-rubber-band"></div>
    </div>
  );
};

export default Loader;
