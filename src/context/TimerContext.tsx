import { createContext, useState, useEffect, useContext, ReactNode, JSX } from 'react'

interface TimerContextValue {
  elapsed: number
}

export const TimerContext = createContext<TimerContextValue>({ elapsed: 0 })

export function useTimer(): TimerContextValue {
  return useContext(TimerContext)
}

export function formatElapsed(elapsed: number): string {
  const totalSec = Math.floor(elapsed / 1000)
  const mm = String(Math.floor(totalSec / 60)).padStart(2, '0')
  const ss = String(totalSec % 60).padStart(2, '0')
  return `${mm}:${ss}`
}

export function TimerProvider({ children }: { children: ReactNode }): JSX.Element {
  const [startTime] = useState(() => Date.now())
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTime])

  return (
    <TimerContext.Provider value={{ elapsed }}>
      {children}
    </TimerContext.Provider>
  )
}
