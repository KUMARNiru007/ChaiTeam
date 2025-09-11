import React from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
  return (

     <div className={`flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br transition-colors duration-300`}>
    <Navbar/>
    <Hero/>
    <Footer/>
    </div>
  )
}

export default Home;