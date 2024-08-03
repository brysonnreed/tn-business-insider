import Link from 'next/link'
import React, { FC, ReactNode } from 'react'

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' // Button type, defaults to 'button'
  children: ReactNode // The content inside the button, can be JSX or text
  onClick?: () => void // Click handler function
  icon?: ReactNode // Optional icon element
  isLoading?: boolean // Indicates loading state
  styleType?: 'primary' | 'secondary' | 'secondaryWhite' | 'link' // Different button styles
  disabled?: boolean // Disable the button
  href?: string // If provided, renders as a link instead of a button
  target?: '_self' | '_blank' // Determines how to open the link (default '_self')
}

const Button: FC<ButtonProps> = ({
  type = 'button',
  children,
  onClick,
  icon,
  isLoading = false,
  styleType = 'primary',
  disabled = false,
  href,
  target = '_self',
}) => {
  const styleClassMap = {
    primary:
      'mt-5 flex w-full items-center justify-center gap-2 rounded bg-orange-500 px-5 py-2 text-xl text-white transition-all duration-300 hover:scale-[1.01] hover:bg-amber-600',
    secondary: `bg-orange-500 px-5 py-2 text-white transition-all duration-300  hover:bg-amber-600`,
    secondaryWhite: `bg-white px-5 py-2 border-2 border-black  transition-all duration-300 hover:bg-slate-100`,
    link: 'text-blue-400 transition-all duration-200 hover:underline',
  }

  const styleClass = styleClassMap[styleType] || styleClassMap.primary

  // If href is provided, render as a link
  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={`${styleClass}`}
        onClick={disabled || isLoading ? undefined : onClick}
        aria-disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>Loading...</>
        ) : (
          <>
            {children}
            {icon && !isLoading && <span>{icon}</span>}
          </>
        )}
      </Link>
    )
  }

  // Render as a button if href is not provided
  return (
    <button
      type={type}
      className={`${styleClass}`}
      onClick={disabled || isLoading ? undefined : onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          {children}
          {icon && !isLoading && <span>{icon}</span>}
        </>
      )}
    </button>
  )
}

export default Button
