import React, { FC } from 'react'

interface TextProps {
  children: React.ReactNode // Content of Text
  className?: string // Additional classes
}

const Text: FC<TextProps> = ({ children, className = '' }) => {
  const baseStyle = 'text-base font-normal text-gray-500 sm:text-lg'
  return <p className={`${baseStyle} ${className}`}>{children}</p>
}

export default Text
