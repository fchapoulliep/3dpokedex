/**
 * Importing React and the loader CSS.
 */
import React from "react";
import "../css/loader.scss";

/**
 * Props for the Loader component.
 */
interface LoaderProps {
  /** Fades the loader out, while the model comes forward. */
  closing: boolean;
  /** Called once the loader has faded out, for the page to remove it. */
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
      className={`loader${closing ? " closing" : ""}`}
      onAnimationEnd={(event) => {
        // The Pokeball's own animation bubbles up too: only the loader's fade-out counts.
        if (event.target === event.currentTarget && event.animationName === "loaderOut") {
          onClosed();
        }
      }}
    >
      <div className="o-pokeball c-loader u-rubber-band"></div>
    </div>
  );
};

export default Loader;
