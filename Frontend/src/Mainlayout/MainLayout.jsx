import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

const MainLayout = () => {
  return (
    <div className='bg-[#000] text-white w-full h-[100vh]'>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default MainLayout