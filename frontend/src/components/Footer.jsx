import React from "react";
import { Link } from "react-router-dom";

import { useTheme } from "../context/ThemeContext.jsx";

const Footer = () => {
  const { darkMode } = useTheme();

  return (
    <footer
      className={`w-full h-[75px] px-20 flex items-center justify-between border-t-[1px] ${
        darkMode
          ? "bg-[#111111] text-white border-[#343434]"
          : "bg-white text-black"
      }`}
    >
      <div className="text-center flex items-center justify-between gap-4">
        <Link to="/" className="hover:text-[var(--chaiteam-orange-hover)]">
          Help & Support
        </Link>
        <Link to="/" className="hover:text-[var(--chaiteam-orange-hover)]">
          Report a issue
        </Link>
      </div>

      <div className="text-center flex items-center justify-between gap-10">
        <div>
          <span>
            &copy; 2025 Chai
            <span
              style={{
                color: "var(--chaiteam-organe-dark)",
              }}
            >
              Team.{" "}
            </span>
            All rights reserved
          </span>
        </div>

        <div className="flex items-center justify-center gap-5">
          <Link
            to="/"
            className="text-2xl hover:text-[var(--chaiteam-orange-hover)]"
          >
            <i className="ri-youtube-fill"></i>
          </Link>
          <Link
            to="/"
            className="text-xl hover:text-[var(--chaiteam-orange-hover)]"
          >
            <i className="ri-twitter-x-fill"></i>
          </Link>
          <Link
            to="/"
            className="text-xl hover:text-[var(--chaiteam-orange-hover)]"
          >
            <i className="ri-linkedin-fill"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
