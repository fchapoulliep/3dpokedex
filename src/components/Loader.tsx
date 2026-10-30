/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.scss";

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /** Plays the closing animation (the black disc shrinks to the center). */
  closing: boolean;
  /** Called once the closing animation is over, for the page to remove the loader. */
  onClosed: () => void;
}

/**
 * Loader component that displays a loading animation.
 *
 * This component includes:
 * - A Pokeball animation.
 *
 * @component
 * @example
 * return (
 *   <Loader closing={modelReady} onClosed={() => setShowLoader(false)} />
 * )
 */
const Loader: React.FC<LoaderProps> = ({ closing, onClosed }) => {
  return (
    <div
      className={`loader${closing ? " animation" : ""}`}
      onAnimationEnd={(event) => {
        // The Pokeball bounces forever: only the disc's own closing animation counts.
        if (event.target === event.currentTarget && closing) {
          onClosed();
        }
      }}
    >
      <div className="o-pokeball c-loader u-rubber-band"></div>
    </div>
  );
};

export default Loader;
