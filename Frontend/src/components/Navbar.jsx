import React from 'react'
import Input from '../utils/Input'
import Button from '../utils/Button'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";

const Navbar = () => {
  return (
    <div className='h-[72px] border-b-2 border-[##EAECF0]  px-4  md:px-8'>
      {/* DESKTOP MENU */}
      <div className='hidden sm:flex justify-between items-center'>
        {/* LOGO */}
        <img src="/Logo/Logo.png"
        className='w-16 h-16 bg-cover '
        loading='lazy'

         alt="" />
        {/* SEARCH */}
        <div>
          {/* SEARCH ICON */}
          {/* INPUT FIELD */}
          <Input
          type='text'
          placeholder='Search'
          className=' h-[35px] w-[300px] md:w-[400px]'
          />
        </div>
        {/* BUTTONS */}
        <div className='flex gap-6 md:gap-8 justify-center items-center'>
          {/* THREE DOTS */}
          <HiOutlineDotsVertical
          className='cursor-pointer'
          />
          {/* LOGIN */}
          <Button
          value="Log in"
          />
          {/* SIGNUP */}
          <div className='bg-[#AE7AFF] shadow-custom py-1 px-2'
          >
          <Button
          value="Sign up"
          className="text-black"
          />
          </div>
        </div>
      </div>
      {/* MOBILE MENU */}
      <div className='sm:hidden flex justify-between items-center'>
        {/* LOGO */}
        <img src="/Logo/Logo.png" 
        className='w-16 h-16 bg-cover ml-7 '
        alt="" />
        <div className='flex justify-center items-center gap-2'>
          {/* Serch Bar */}
          <FiSearch className='text-3xl cursor-pointer' />
          {/* Hamburger */}
          <img src="/Logo/Hamburger.png"
          className='w-16 h-16 bg-cover cursor-pointer '
          
          alt=""
          
          />


        </div>
      </div>
    </div>
  )
}

export default Navbar