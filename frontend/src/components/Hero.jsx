import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { useTheme } from "../context/ThemeContext.jsx";
import GroupImage from "../assets/Groups1.png";

function Hero() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col items-center pt-28 overflow-hidden transition-all duration-200 ${
        darkMode ? "text-white bg-[#111111]" : "text-black bg-white"
      }`}
    >
      {/* Headings */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
      >
        <span className="parkinsans-Regular sm:text-5xl md:text-6xl lg:text-7xl pb-2">
          Find Your{" "}
          <span
            style={{
              color: "var(--chaiteam-organe-dark)",
            }}
          >
            Tribe,
          </span>
        </span>
        <span className="parkinsans-bold sm:text-5xl md:text-6xl lg:text-7xl pb-2">
          Build Your Network
        </span>
      </motion.div>

      {/* Subtext */}
      <motion.div
        className="pt-4 flex flex-col items-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-base sm:text-lg md:text-2xl">
          Connect with like-minded students for fun,
        </span>
        <span className="text-base sm:text-lg md:text-2xl">
          friendships and future Opportunities.
        </span>
      </motion.div>

      {/* Button */}
      <motion.button
        style={{
          backgroundColor: "var(--chaiteam-btn-start)",
          color: `${darkMode ? "white" : "black"}`,
          border: "none",
          padding: "9px 24px",
          borderRadius: "8px",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-medium)",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          marginTop: "35px",
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
        onMouseEnter={(e) =>
          (e.target.style.backgroundColor = "var(--chaiteam-btn-primary-hover)")
        }
        onMouseLeave={(e) =>
          (e.target.style.backgroundColor = "var(--chaiteam-btn-start)")
        }
        onClick={() => navigate("/dashboard")}
        className="z-10"
      >
        Start your journey
      </motion.button>

      {/* Group Image (appears first) */}
      <motion.div
        className="absolute -bottom-[23rem] overflow-hidden w-full flex justify-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
      >
        <img
          src={GroupImage}
          alt="Group of students"
          className="w-full object-cover overflow-hidden"
        />
      </motion.div>
    </div>
  );
}

export default Hero;
