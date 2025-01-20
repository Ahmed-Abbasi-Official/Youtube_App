import React from 'react'
import HomeCard from './HomeCard'

const HomeMainBar = () => {
  return (
    <div className='w-full flex flex-wrap py-4 mx-auto lg:gap-4 gap-6 sm
    :gap-2  justify-center md:w-[80%] overflow-y-auto'>
      <HomeCard/>
      <HomeCard/>
      <HomeCard/>
      <HomeCard/>
      <HomeCard/>
      <HomeCard/>
    </div>
  )
}

export default HomeMainBar