import React from 'react'
import { motion } from 'motion/react'
import Navbar from "../components/Navbar.jsx"
import Footer from "../components/Footer.jsx"
import { useTheme } from "../context/ThemeContext.jsx"
import creator1 from "./assets/creator1.webp"
import creator2 from "./assets/creator2.webp"
import ChaiCodeImageBlack from "../assets/chaicode-black.svg";
import ChaiCodeImageWhite from "../assets/chaicode-white.svg";

function AboutUs() {
  const { darkMode } = useTheme();

  return (
    <div className={`parkinsans-light flex flex-col items-center min-h-screen w-full ${darkMode ? "bg-[#111111] text-white" : "bg-white text-black"}`}>
      <Navbar />
      
      {/* Main content */}
      <div className="w-full max-w-6xl px-6 pt-28 pb-16">
        {/* About Project Section */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
        >
          
          <h1 className="parkinsans-bold text-4xl md:text-5xl mb-6">
            About {" "}
            <span className={` ${darkMode ? '' : '!text-black'}`}>
               Chai
              <span className='text-[var(--chaiteam-orange)]'>Hub</span>
            </span>
          </h1>
       
          
          <p className="text-lg mb-6">
            ChaiTeam is a collaborative platform designed to connect like-minded students, fostering teamwork and building networks. 
            Our mission is to create a space where students can find their tribe, collaborate on projects, and develop essential skills for their future careers.
          </p>
          
          <p className="text-lg mb-6">
            The platform offers features like team creation, collaborative workspaces, and skill development opportunities. 
            We believe in the power of community and how working together can lead to greater innovation and learning.
          </p>

          <div className={`grid md:grid-cols-2 gap-8 mt-10 ${darkMode ? "text-white" : "text-black/60"}`}>
            <div className={`p-6 rounded-lg border-1 transition-all duration-200 ${darkMode ? "bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20" : "bg-white border-slate-300 hover:bg-[#ff9335]/10"}`}>
              <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
              <p>
                To create a network of student's who collaborat and support each other's growth and development through meaningful connections and shared experiences.
              </p>
            </div>
            
            <div className={`p-6 rounded-lg border-1 transition-all duration-200 ${darkMode ? "bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20" : "bg-white border-slate-300 hover:bg-[#ff9335]/10"}`}>
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p>
                To provide students with the tools, resources, and community they need to thrive academically and professionally while building lasting relationships.
              </p>
            </div>
          </div>
        </motion.div>

        {/* About Makers Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="parkinsans-bold text-3xl md:text-4xl mb-8">
            Meet the <span style={{ color: "var(--chaiteam-orange)" }}>Creators</span>
          </h2>
          
          <div className={`grid md:grid-cols-2 gap-10 ${darkMode ? "text-white" : "text-black/60"}`}>
            {/* Creator 1 */}
            <div className={`p-6 rounded-lg border-1 transition-all duration-200 ${darkMode ? "bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20" : "bg-white border-slate-300 hover:bg-[#ff9335]/10"}`}>
              <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-[var(--chaiteam-orange)]">
                  {/* Replace with actual image */}
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <img
              src={creator1}
              className="object-cover"
              alt="Logo"
            />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Kumar Nirupam</h3>
                <p className="text-sm mb-2">Full Stack Developer</p>
                <div className="flex gap-4 text-xl">
                  <a href="https://github.com/KUMARNiru007" className="hover:text-[var(--chaiteam-orange-hover)]"
                  target="_blank">
                    <i className="ri-github-fill"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/kumarnirupam/" className="hover:text-[var(--chaiteam-orange-hover)]"
                  target="_blank">
                    <i className="ri-linkedin-fill"></i>
                  </a>
                  <a href="https://x.com/KumarNirupam1" className="hover:text-[var(--chaiteam-orange-hover)]"
                  target="_blank">
                    <i className="ri-twitter-x-fill"></i>
                  </a>
                </div>
              </div>
              <p className="text-center">
                A passionate developer with expertise in React and Node.js. Focused on creating intuitive user experiences and robust backend systems.
              </p>
            </div>
            
            {/* Creator 2 */}
            <div className={`p-6 rounded-lg border-1 transition-all duration-200 ${darkMode ? "bg-[#18181B] border-[#343434] hover:bg-[#9e9e9e]/20" : "bg-white border-slate-300 hover:bg-[#ff9335]/10"}`}>
              <div className="flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-2 border-[var(--chaiteam-orange)]">
                  {/* Replace with actual image */}
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <img
              src={creator2}
              className="object-cover"
              alt="Logo"
            />
                  </div>
                </div>
                <h3 className="text-xl font-bold">Sanket Singh</h3>
                <p className="text-sm mb-2">Full-Stack Developer</p>
                <div className="flex gap-4 text-xl">
                  <a href="https://github.com/sanketsingh01" className="hover:text-[var(--chaiteam-orange-hover)]"
                  target="_blank">
                    <i className="ri-github-fill"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/sanket-singh-5359732b8/" className="hover:text-[var(--chaiteam-orange-hover)]"
                  target="_blank">
                    <i className="ri-linkedin-fill"></i>
                  </a>
                  <a href="https://x.com/SinghSanket78" className="hover:text-[var(--chaiteam-orange-hover)]"
                  target="_blank">
                    <i className="ri-twitter-x-fill"></i>
                  </a>
                </div>
              </div>
              <p className="text-center">
               A committed full-stack developer specializing in React and Node.js. Focused on crafting seamless experiences and efficient server-side logic.


              </p>
            </div>
          </div>
                <div className="flex flex-col items-center justify-center mt-20">
        <span className="text-xl">Developed and Maintained For</span>
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
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}

export default AboutUs