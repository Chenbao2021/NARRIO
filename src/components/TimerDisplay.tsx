import { JSX } from 'react'
import { Typography, SxProps } from '@mui/material'
import { useTimer, formatElapsed } from '../context/TimerContext'

export default function TimerDisplay({ sx }: { sx?: SxProps }): JSX.Element {
  const { elapsed } = useTimer()
  const time = formatElapsed(elapsed)

  return (
    <Typography
      sx={{
        fontFamily: '"Caveat", cursive',
        fontSize: '1.1rem',
        color: '#6b7280',
        background: '#fef9c3',
        border: '1.5px solid #d1d5db',
        borderRadius: '3px 7px 5px 2px',
        px: 1.5,
        py: 0.25,
        display: 'inline-block',
        ...sx,
      }}
    >
      ⏱ {time}
    </Typography>
  )
}
