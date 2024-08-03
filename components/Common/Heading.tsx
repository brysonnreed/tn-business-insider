import React, { FC } from 'react'

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6 // Level of heading (h1, h2, h3, etc.)
  children: React.ReactNode // Content of the heading
  className?: string // Additional classes
}

const Heading: FC<HeadingProps> = ({ level, children, className = '' }) => {
  // Map heading levels to their corresponding HTML tags
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  // Define default styles for different heading levels
  const headingClassMap = {
    1: 'pb-5 text-3xl font-bold capitalize sm:text-5xl',
    2: 'text-3xl font-bold capitalize sm:text-4xl pb-10',
    3: 'text-3xl font-medium mb-4',
    4: 'text-xl font-normal',
    5: 'text-lg font-light',
    6: 'text-base font-light',
  }

  const headingClass = headingClassMap[level] || headingClassMap[1] // Default to h1 styles if level is not found

  return (
    <HeadingTag className={`${headingClass} ${className}`}>
      {children}
    </HeadingTag>
  )
}

export default Heading
