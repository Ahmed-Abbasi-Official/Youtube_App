import React, { useEffect } from 'react'
import HomeSideBar from '../components/HomeSideBar'
import VideoPlayer from '../components/VideoPlayer'
import { useParams } from 'react-router-dom'
import { useVideo } from '../context/Videos.Context'
import { useQuery } from '@tanstack/react-query'

const SingleVideo = () => {
  const {fetchSingleVideo}=useVideo();
  const {slug}=useParams()
  // console.log(slug)

  // GET SINGLE VIDEO

  const { data: video, isLoading, error } = useQuery({
    queryKey: ["video", slug], 
    queryFn: () => fetchSingleVideo(slug),
    enabled: !!slug, // Jab tak slug na ho, request na bhejo
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching video </p>;
  if(!video) return <p>No Video Found</p>

  return (
    <>
    <div className=' flex md:flex-row flex-col h-[calc(100vh-72px)] w-full  bg-black'>
      
      {/* HOME SIDE BAR */}
      <HomeSideBar
      width="81px"
      hidden={'hidden'}
      padding="2"
      />
      
      {/* SINGLE VIDEO */}

        <div className='w-full  overflow-y-auto h-[calc(100vh-72px)]'>
        <VideoPlayer
        video={video?.message}
        />
        </div>

    </div>
    </>
  )
}

export default SingleVideo