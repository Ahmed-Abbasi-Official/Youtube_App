import React from 'react'
import { RiHome3Line , RiHistoryFill } from "react-icons/ri";
import { HiThumbUp } from "react-icons/hi";
import { IoIosVideocam } from "react-icons/io";
import { MdCollectionsBookmark , MdAdminPanelSettings } from "react-icons/md";
import { VscDebugBreakpointUnsupported } from "react-icons/vsc";
import { IoSettingsSharp } from "react-icons/io5";
import {Link} from 'react-router-dom'

const HomeSideBar = ({width="20%",hidden,padding="4"}) => {
  // UPPER BUTTONS ARRAY
  const upperButtons=[
    {
      icon:<RiHome3Line />,
      routeName:'Home',
      path:'/'
    },
    {
      icon:<HiThumbUp />,
      routeName:'Liked Videos',
      path:'/video/liked-videos',
      class:"hidden"
    },
    {
      icon:<RiHistoryFill />,
      routeName:'History',
      path:'/history'
    },
    {
      icon:<IoIosVideocam />,
      routeName:'My Content',
      path:'/my-content',
      class:"hidden"
    },
    {
      icon:<MdCollectionsBookmark />,
      routeName:'Collection',
      path:'/saved-video'
    },
    {
      icon:<MdAdminPanelSettings />,
      routeName:'Subscribers',
      path:'/saved-video'
    },
  ]
  // LOWER BUTTONS ARRAY
  const lowerButtons=[
    {
      icon:<VscDebugBreakpointUnsupported />,
      routeName:'Support',
      path:'/support'
    },
    {
      icon:<IoSettingsSharp />,
      routeName:'Dashboard',
      path:'/dashboard'
    },
  ]
  return (
   <>
   {/* FOR MOBILE */}
   <div className='flex  items-center justify-between px-4 py-2 md:hidden w-full border sticky z-20 bg-black  -bottom-0'>
        {upperButtons.map((elm,idx)=>(
          <div key={elm.routeName} className='flex flex-col justify-start items-center gap-1 cursor-pointer'>
            <span className={`text-lg ${elm?.class}`}>{elm.icon}</span>
            <Link to={elm.path}
            className={`text-xs ${elm?.class}`}
            >{elm.routeName}</Link>
          </div>
        ))}
   </div>
   {/* DESKTOP */}
   <div className={` sticky hidden md:flex flex-col h-[calc(100vh-72px)] justify-between w-[${width}]  px-2 lg:px-4 py-4 border-r-2 border-[##EAECF0]`}>
        {/* UPPER BUTTONS */}
      <div>
        {upperButtons.map((elm,idx)=>(
          <div key={elm.routeName} className={`flex justify-start items-center gap-2 border py-2 px-2 lg:px-${padding} mt-1 cursor-pointer`}>
            <Link to={elm.path}
            className='text-xs lg:text-[16px] font-semibold flex items-center gap-2'
            >
            <span className='text-xl lg:text-2xl'>{elm.icon}</span>
            <span className={`${hidden}`}>{elm.routeName}</span>
            </Link>
          </div>
        ))}
      </div>
        {/* LOWER BUTTONS */}
        <div>
        {lowerButtons.map((elm,idx)=>(
          <div key={elm.routeName} className={`flex justify-start items-center gap-2 border py-2 px-2 lg:px-${padding} mt-1 cursor-pointer`}>
            <Link to={elm.path}
            className='text-xs lg:text-[16px] font-semibold flex items-center gap-2'
            >
              <span className={`${hidden}`}>{elm.routeName}</span>
              <span className='text-xl lg:text-2xl'>{elm.icon}</span>
            </Link>
          </div>
        ))}
        </div>
    </div>
   </>
  )
}

export default HomeSideBar