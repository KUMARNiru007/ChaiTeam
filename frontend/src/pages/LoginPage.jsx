import React from "react";
import { Link } from "react-router-dom";

import GoogleIcon from "../assets/google.svg";
import GithubIcon from "../assets/github.svg";
import ChaiCodeImageBlack from "../assets/chaicode-black.svg";
import ChaiCodeImageWhite from "../assets/chaicode-white.svg";
import { authService } from "../services/api";

import { useTheme } from "../context/ThemeContext.jsx";

function LoginPage() {
  const { darkMode } = useTheme();

  return (
    <div
      className={`parkinsans-light w-full min-h-screen flex flex-col justify-center items-center ${
        darkMode ? "bg-[#111111] text-white" : "bg-white text-black"
      }`}
    >
      <div
        className={`flex flex-col relative overflow-hidden h-auto box-border outline-none m-6 rounded-lg border-[1px] px-6 py-8 shadow-sm sm:w-[480px] ${
          darkMode ? "border-[#343434]" : " border-black/20"
        }`}
      >
        <div className="mt-3 flex w-full flex-col items-center justify-center gap-y-1">
          <p className="parkinsans-bold text-4xl">
            Chai
            <span className="text-orange-500 dark:text-orange-400">Team</span>
          </p>

          <p>Welcome Back</p>
        </div>

        <div className="mx-auto mt-5 max-w-[400px] pb-6 text-center text-lg">
          Please login using the same email address you used to purchase the
          course
        </div>

        <div className="flex justify-center gap-4 pb-2">
          <button
            onClick={() => authService.googleLogin()}
            className={`relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden bg-transparent px-4 min-w-20 h-10 gap-2 !rounded-md !border-[1px] py-5 ${
              darkMode
                ? "!border-[#343434] hover:bg-[#9e9e9e]/20"
                : " !border-black/30 hover:bg-gray-200"
            }`}
          >
            <img
              src={GoogleIcon}
              alt="Google Icon"
              className="object-contain h-6"
            />
            <span className="hidden text-xs sm:ml-0.5 sm:block">
              Continue with Google
            </span>
          </button>
        </div>

        <div className="m-auto mb-2 mt-4 max-w-[350px] text-center text-[17px]">
          By signing in, you agree to the{" "}
          <a
            href="https://www.chaicode.com/terms-of-services"
            target="_blank"
            className="text-orange-400"
          >
            Terms of Services{" "}
          </a>
          and{" "}
          <a
            href="https://www.chaicode.com/privacy-policy"
            target="_blank"
            className="text-orange-400"
          >
            Privacy Policy
          </a>
          .
        </div>
      </div>

      <Link
        to="/"
        className="mt-2 w-full flex cursor-pointer items-center justify-center gap-1 text-center font-light hover:text-[var(--chaiteam-orange-hover)]"
      >
        👈 Back to home
      </Link>

      <div className="flex flex-col items-center justify-center cursor-pointer mt-20">
        <span className="text-xs">Brought to you By</span>
        <a href="https://www.chaicode.com/" target="_blank">
          <div className="w-64 h-auto mt-2 cursor-pointer">
            <img
              src={darkMode ? ChaiCodeImageWhite : ChaiCodeImageBlack}
              alt="Chai code Image"
              className="object-cover"
            />
          </div>
        </a>
      </div>
    </div>
  );
}

export default LoginPage;
