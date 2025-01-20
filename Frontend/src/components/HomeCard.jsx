import React from 'react'

const HomeCard = () => {
  return (
    <div className='flex flex-col gap-2 w-[40%] 540px:w-[90%] sm:w-[30%] lg:w-[23%] cursor-pointer overflow-hidden'>
        {/* THUMBNAIL */}
        <img src="/Main/card6.png"
        className='w-full mx-auto'
        alt="" /> 
        {/* DETAILS */}
        <div className='flex items-center 540px:justify-start justify-center gap-4 w-full'>
            <img src="/Main/Avatar.png"
            className='w-10 h-10 540px:w-14 540px:h-14 rounded-full'
            loading='lazy'
            alt="User Image" />
            <div className='flex flex-col justify-center 540px:w-full  gap-.5'>
                {/* TITLE */}
                <h2 className='text-sm   leading-5 mb-1 w-[99%]'>How to Learn react | A React Roadmap</h2>
                {/* VIEWS + TIME */}
                <div className='flex items-center gap-2 text-xs '>
                    <p>100K Views</p>
                    <span>18 hours ago</span>
                </div>
                {/* CHANNEL NAME */}
                <h2 className='text-xs text-gray-400 mb-4'>Ahmed Abbasi</h2>
            </div>
        </div>
    </div>
  )
}

export default HomeCard