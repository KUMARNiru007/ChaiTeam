import React from 'react'
import Batches from '../docs/Batches';
import Groups from '../docs/Groups';

function Docs() {
  return (
    <div  className={`flex min-h-screen w-full transition-colors duration-300`} >

      <div className='flex-1 flex flex-col'>
        <div
          className={` overflow-auto rounded-lg transition-colors duration-300`}
        >
          <Routes>
            <Route path='batches' element= {<Batches/>}/>
            <Route path='batches/:id' element= {<BatchPage/>}/>
            <Route path='groups' element= {<Groups/>}/>
            <Route path='groups/:id' element= {<GroupPage/>}/>
          </Routes>
          </div>
          </div>
    </div>
  )
}

export default Docs;