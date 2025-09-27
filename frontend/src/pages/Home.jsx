import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Footer from "../components/Footer.jsx";
import Features from "../components/Features.jsx";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="parkinsans-light flex flex-col items-center min-h-screen w-full">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;
