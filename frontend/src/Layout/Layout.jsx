import React from 'react'
import Sidebar from '../components/Sidebar'
import Home from '../pages/Home';
import AboutUs from '../pages/AboutUs';
import NotFound from '../pages/NotFound';
import Docs from '../Layout/Docs.jsx';

function Layout() {
  return (
    <div className={`w-full pt-16 overflow-x-hidden transition-colors duration-300 ease-in-out` }>
      <div>
        <div className='hidden md:block w-[280px] py-3 transiton-all'>
          <Sidebar/>
        </div>

        <div className='flex-1 min-h-screen'>
          <div className='w-full'>
            <div>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/docs/*' element={<Docs />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/*' element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
 

    </div>
  )
}

export default Layout