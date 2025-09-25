import React from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br transition-colors duration-300">
      <Navbar />
      <Hero />
      <div className="text-center my-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 text-lg"
        >
          Get Started
        </button>
      </div>
      <Footer />
    </div>
  )
}

export default Home;