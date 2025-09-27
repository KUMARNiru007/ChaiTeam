import React from "react";
import { useNavigate } from "react-router-dom";
import GroupImage from "../assets/Groups1.png";

function Hero() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full bg-white text-black flex flex-col items-center pt-28 overflow-hidden">
      {/* Headings */}
      <div className="flex flex-col items-center">
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
      </div>

      {/* Subtext */}
      <div className="pt-4 flex flex-col items-center">
        <span className="text-base sm:text-lg md:text-2xl">
          Connect with like-minded students for fun,
        </span>
        <span className="text-base sm:text-lg md:text-2xl">
          friendships and future Opportunities.
        </span>
      </div>

      {/* Button */}
      <button
        style={{
          backgroundColor: "var(--chaiteam-btn-start)",
          color: "black",
          border: "none",
          padding: "9px 24px",
          borderRadius: "8px",
          fontSize: "var(--font-size-base)",
          fontWeight: "var(--font-weight-medium)",
          cursor: "pointer",
          transition: "background-color 0.2s ease",
          marginTop: "35px",
        }}
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
      </button>

      {/* Group Image (relative to hero & overflow hidden) */}
      <div className="absolute -bottom-[23rem] overflow-hidden w-full flex justify-center">
        <img
          src={GroupImage}
          alt="Group of students"
          className="w-full object-cover overflow-hidden"
        />
      </div>
    </div>
  );
}

export default Hero;
