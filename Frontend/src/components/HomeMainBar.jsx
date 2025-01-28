import React from 'react'
import HomeCard from './HomeCard'
import { useVideo } from '../context/Videos.Context'

const HomeMainBar = () => {
  const { allVideos , allVideosError , allVideosLoading } = useVideo();
  if(allVideosLoading){
    return <p>Loading...</p>
  }
  if(allVideosError){
    return <p>Error in fetching data: {allVideosError}</p>
  }
  console.log(allVideos)
  return (
    <div className='w-full flex flex-wrap py-4 mx-auto lg:gap-4 gap-6 sm
    :gap-2  justify-center md:w-[80%] overflow-y-auto'>
      {
        allVideos && (
          allVideos?.message?.map((video)=>{
            return (
              <HomeCard
              key={video._id}
              video={video} />
            )
          })
        )
      }
    </div>
  )
}

export default HomeMainBar