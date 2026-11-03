/**
 * Importing React and the NavBar CSS.
 */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/navbar.css";

/**
 * NavBar component renders the navigation bar for the Pokedex 3D application.
 * It includes links to the Home, About, and Contact pages.
 *
 * @component
 * @example
 * return (
 *   <NavBar />
 * )
 */
const NavBar: React.FC = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav id="navbar">
      <div className="navbar-pokedex">
        <div className="navbar-link">
          {/* Phones show the short labels: the long ones overflowed the bar */}
          <Link to="/" aria-label="Back to the Pokédex">
            <span className="label-long">Back to the Pokédex</span>
            <span className="label-short" aria-hidden="true">Pokédex</span>
          </Link>
        </div>
        <div className="navbar-time">{time}</div>
        <div className="navbar-link">
          <a
            href="https://fchapoulliep.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Creator's portfolio"
          >
            <span className="label-long">Creator's portfolio</span>
            <span className="label-short" aria-hidden="true">Portfolio</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
