import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black w-full h-[75px] px-20 flex items-center justify-between border-t-[1px]">
      <div className="text-center flex items-center justify-between gap-4">
        <Link to="/" className="text-black hover:[var(--chaiteam-organe-dark)]">
          Help & Support
        </Link>
        <Link
          to="/"
          className="text-black hover:[var(--chaiteam-organe-dark)]0"
        >
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
          <Link to="/" className="text-2xl hover:[var(--chaiteam-organe-dark)]">
            <i class="ri-youtube-fill"></i>
          </Link>
          <Link to="/" className="text-xl hover:[var(--chaiteam-organe-dark)]">
            <i class="ri-twitter-x-fill"></i>
          </Link>
          <Link to="/" className="text-xl hover:[var(--chaiteam-organe-dark)]">
            <i class="ri-linkedin-fill"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
