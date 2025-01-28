import React, { useState } from 'react'
import { useUser } from '../context/User.Context'
import Button from '../utils/Button';
import UploadModal from '../components/UploadVideoModal';

const Dashboard = () => {
    const { user , userError , userLoading }=useUser();
    const [showUploadModal , setShowUploadModal] =useState(false);

    if(userLoading) {
        return <div>Loading...</div>
    }

    if(userError) {
        return <div>Error: {userError.message}</div>
    }

    if(user){
        return <div>You are not logged in.</div>
    }
    console.log(user)
  return (
    <div className='px-3 sm:px-6 md:px-28 md:py-8 sm:py-4 py-2 relative'>
        <div className='flex sm:flex-row flex-col justify-start gap-2 sm:gap-0 sm:items-center sm:justify-between'>
            <div className='flex flex-col gap-.5 sm:gap-2'>
                <h1 className='md:text-3xl sm:text-xl text-lg font-semibold'>Welcome back, {user?.message?.fullName}</h1>
                <p className='text-[10px] sm:text-xs md:text-[16px]'>Track, manage and forecast your customers and orders.</p>
            </div>
            <button 
            className='bg-[#AE7AFF] text-black font-semibold px-4 py-1 sm:px-8 sm:py-2 w-fit '
            onClick={()=>{
                setShowUploadModal((prev)=>!prev);
            }}
            >+ Upload</button>
        </div>

       { showUploadModal &&  <UploadModal
       setShowUploadModal={setShowUploadModal}
       />}
        
    </div>
  )
}

export default Dashboard