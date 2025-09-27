import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-20 backdrop-blur-xl w-full h-[75px] bg-transparent text-black flex items-center justify-between px-20 text-2xl text-cente border-b-[1px]">
      <div>
        <span className="text-2xl text-[#F97316] font-bold">Chai</span>
        <span className="text-2xl font-medium">Team</span>
      </div>

      <div className="flex items-center justify-center gap-5">
        <div
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
            className="ri-moon-fill"
            style={{ color: "#000000", fontSize: "18px" }}
          ></i>
        </div>

        <button
          style={{
            backgroundColor: "var(--chaiteam-btn-start)",
            color: "black",
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
        >
          Get Started
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
