import { createContext, useContext, useEffect, useState } from 'react'

const TOAST_DISPLAY_KEY = 'toastsDisplayed'
const TOAST_EXPIRATION_TIME = 2 * 60 * 1000 // 2 minutes in milliseconds

const ToastDisplayContext = createContext()

export function ToastDisplayProvider({ children }) {
  const [toastsDisplayed, setToastsDisplayed] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedToasts = localStorage.getItem(TOAST_DISPLAY_KEY)
      if (storedToasts) {
        const parsedToasts = JSON.parse(storedToasts)
        const currentTime = new Date().getTime()
        const validToasts = parsedToasts.filter(
          (item) => !item.expiry || item.expiry > currentTime
        )
        return validToasts
      }
    }
    return []
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOAST_DISPLAY_KEY, JSON.stringify(toastsDisplayed))
    }
  }, [toastsDisplayed])

  const addToastDisplayed = (queryKey, expiry = TOAST_EXPIRATION_TIME) => {
    const currentTime = new Date().getTime()
    setToastsDisplayed((prevToasts) => [
      ...prevToasts,
      { key: queryKey, expiry: currentTime + expiry },
    ])
  }

  const isToastDisplayed = (queryKey) => {
    const currentTime = new Date().getTime()
    return toastsDisplayed.some(
      (item) =>
        item.key === queryKey && (!item.expiry || item.expiry > currentTime)
    )
  }

  return (
    <ToastDisplayContext.Provider
      value={{ addToastDisplayed, isToastDisplayed }}
    >
      {children}
    </ToastDisplayContext.Provider>
  )
}

export function useToastDisplay() {
  return useContext(ToastDisplayContext)
}
