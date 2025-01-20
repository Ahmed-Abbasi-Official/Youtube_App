import React from 'react'

const Button = ({value,className}) => {
  return (
    <div className={`text-[16px] font-semibold text-white cursor-pointer ${className} `}>{value}</div>
  )
}

export default Button