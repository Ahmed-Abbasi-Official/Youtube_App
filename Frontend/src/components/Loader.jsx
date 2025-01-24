import React from 'react';
import './Loader.css';
// import Logo from '/public/Images/Loader.png';
const Loader = () => {
   
  return (
    <div className="loader-container">
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className='mt-8 '>
       <h2 className='text-xl font-bold '>PLAY</h2>
      </div>
    </div>
  );
};

export default Loader;