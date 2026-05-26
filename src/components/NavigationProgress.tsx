import { useEffect, useRef, useState, useCallback, JSX } from 'react'
import { useLocation } from 'react-router-dom'
import { Box } from '@mui/material'

export default function NavigationProgress(): JSX.Element {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const isFirst = useRef(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showProgress = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(true)
    timerRef.current = setTimeout(() => setVisible(false), 700)
  }, [])

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    showProgress()
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [location.pathname, showProgress])

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '3px',
        background: '#ca8a04',
        zIndex: 9999,
        animation: visible ? 'navProgressFill 0.7s ease forwards' : 'none',
        opacity: visible ? 1 : 0,
        transition: visible ? 'none' : 'opacity 0.3s ease',
        width: visible ? undefined : '0%',
      }}
    />
  )
}
