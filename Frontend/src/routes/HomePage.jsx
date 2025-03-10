import React from 'react'
import HomeSideBar from '../components/HomeSideBar'
import HomeMainBar from '../components/HomeMainBar'

const HomePage = () => {
  return (
    <div className='flex md:flex-row  flex-col-reverse w-full h-[calc(100vh-72px)] md:justify-start  justify-between'>
      {/* HOME SIDE BAR */}
      <HomeSideBar/>
      {/* Scrollable categories with custom scrollbar */}
      
      {/* HOME MAIN BA */}
      <HomeMainBar/>
      </div>
  )
}

export default HomePage

