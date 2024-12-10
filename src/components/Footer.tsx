import React from "react";
import "../css/footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-copyrights">
        <p>
          &copy; {new Date().getFullYear()} Florian Chapoullié-Pino. All rights
          reserved.
        </p>
      </div>
      <div className="footer-links">
        <a
          href="https://fchapoulliep.github.io/portfolio/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio
        </a>
        <a
          href="https://github.com/fchapoulliep"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/florianpino/"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
      </div>
      <div className="footer-credits">
        <p>
          Designed by <b>Florian Chapoullié-Pino</b>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
