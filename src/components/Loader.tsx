import React from "react";
import "../css/loader.scss";

const Loader: React.FC = () => {
  return (
    <div className="loader">
      <div className="o-pokeball c-loader u-rubber-band"></div>
    </div>
  );
};

export default Loader;
