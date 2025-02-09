import React,{Suspense} from 'react'
const HomeCard = React.lazy(() => import("./HomeCard"));
import { useVideo } from '../context/Videos.Context'


const HomeMainBar = () => {
  const { allVideos, allVideosError, allVideosLoading } = useVideo();

  // if (allVideosLoading) {
  //   return <p>Loading...</p>;
  // }
  if (allVideosError) {
    return <p>Error in fetching data: {allVideosError}</p>;
  }
  if(allVideos?.message?.length===0){
    return <p>No Videos Yet</p>
  }

  return (
    <>
    <div className="w-full grid gap-6 sm:gap-4 md:gap-6 py-4 px-2 md:w-[100%] overflow-y-auto
    grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {allVideos?.message?.map((video) => (
        <Suspense fallback={<p>This is Loading</p>} >
          <HomeCard key={video._id} video={video} />
        </Suspense>
      ))}
    </div>
    </>
  );
};

export default HomeMainBar;
