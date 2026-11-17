import { useCallback, useRef, useState } from 'react'
import { NotificationContext } from './notificationContext'

export const NotificationContextProvider = ({ children }) => {
  const [notification, setNotification] = useState('')
  const timeoutRef = useRef(null)

  const notify = useCallback((message) => {
    setNotification(message)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setNotification('')
      timeoutRef.current = null
    }, 5000)
  }, [])

  return (
    <NotificationContext.Provider value={{ notification, notify }}>
      {children}
    </NotificationContext.Provider>
  )
}
