import { Box, Typography } from '@mui/material'
import { JSX } from 'react'

const SpinnerDoodle = (): JSX.Element => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
    <circle
      cx="24" cy="24" r="20"
      stroke="#2d2d2d"
      strokeWidth="2.5"
      strokeDasharray="62 38"
      strokeLinecap="round"
      style={{ animation: 'spinnerRotate 0.9s linear infinite', transformOrigin: '24px 24px' }}
    />
  </svg>
)

export default function PageLoader(): JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 2,
      }}
    >
      <SpinnerDoodle />
      <Typography
        sx={{
          color: '#9ca3af',
          fontFamily: '"Caveat", cursive',
          fontSize: '1.4rem',
        }}
      >
        Chargement...
      </Typography>
    </Box>
  )
}
