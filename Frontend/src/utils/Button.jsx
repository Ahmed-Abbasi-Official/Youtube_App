import React from 'react'

const Button = ({value,className, type }) => {
  return (
    <button
    type={type}
    className={`text-[16px] font-semibold text-white cursor-pointer ${className} `}>{value}</button>
  )
}

export default Button