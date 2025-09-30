import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";

import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <motion.nav
      className={`fixed top-0 z-20 backdrop-blur-xl w-full h-[75px] bg-transparent flex items-center justify-between px-20 text-2xl text-cente border-b-[1px]  transition-all duration-200 ${
        darkMode ? "text-white border-[#343434]" : "text-black border-black"
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6, ease: "easeIn" }}
    >
      <div className="cursor-pointer">
        <Link to="/">
          <span className="text-2xl text-[#F97316] font-bold">Chai</span>
          <span className="text-2xl font-medium">Team</span>
        </Link>
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          onClick={toggleTheme}
          style={{
            width: "32px",
            height: "32px",
            // backgroundColor: "#2d2d2d",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <i
            className={`ri-${darkMode ? "sun" : "moon"}-fill`}
            style={{
              color: `${darkMode ? "#ffffff" : "#000000"}`,
              fontSize: "18px",
            }}
          ></i>
        </button>

        <button
          style={{
            backgroundColor: "var(--chaiteam-btn-start)",
            color: `${darkMode ? "white" : "black"}`,
            border: "none",
            // padding: "0px 24px",
            borderRadius: "8px",
            fontSize: "var(--font-size-xs)",
            fontWeight: "var(--font-weight-normal)",
            cursor: "pointer",
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) =>
            (e.target.style.backgroundColor =
              "var(--chaiteam-btn-primary-hover)")
          }
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "var(--chaiteam-btn-start)")
          }
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
