import { useState, useEffect, useRef, useCallback, JSX } from 'react'
import { Typography, Box, SxProps, Theme } from '@mui/material'

interface TypewriterTextProps {
  text: string
  speed?: number
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption'
  sx?: SxProps<Theme>
  grow?: boolean
}

export default function TypewriterText({
  text,
  speed = 40,
  variant = 'body1',
  sx,
  grow = false,
}: TypewriterTextProps): JSX.Element {
  const [displayed, setDisplayed] = useState('')
  const skippedRef = useRef(false)

  useEffect(() => {
    let effectCancelled = false
    skippedRef.current = false
    setDisplayed('')

    ;(async () => {
      for (let i = 0; i < text.length; i++) {
        if (effectCancelled || skippedRef.current) break
        setDisplayed(text.slice(0, i + 1))
        await new Promise<void>((res) => setTimeout(res, speed))
      }
    })()

    return () => { effectCancelled = true }
  }, [text, speed])

  const handleSkip = useCallback(() => {
    skippedRef.current = true
    setDisplayed(text)
  }, [text])

  const fontFamily = variant?.startsWith('h') ? '"Caveat", cursive' : '"Nunito", sans-serif'
  const isTyping = displayed.length < text.length
  const cursor = (
    <span style={{ display: 'inline-block', width: 2, height: '1em', background: '#2d2d2d', marginLeft: 2, verticalAlign: 'text-bottom', opacity: 0.7 }} />
  )

  if (grow) {
    return (
      <Typography
        variant={variant}
        onClick={handleSkip}
        sx={{ fontFamily, whiteSpace: 'pre-wrap', cursor: isTyping ? 'pointer' : 'default', ...sx }}
      >
        {displayed}
        {isTyping && cursor}
      </Typography>
    )
  }

  return (
    <Typography
      variant={variant}
      onClick={handleSkip}
      sx={{
        fontFamily,
        whiteSpace: 'pre-wrap',
        cursor: isTyping ? 'pointer' : 'default',
        position: 'relative',
        ...sx,
      }}
    >
      {/* Placeholder invisible pour réserver la taille finale dès le début */}
      <Box component="span" aria-hidden="true" sx={{ visibility: 'hidden', display: 'block' }}>
        {text}
      </Box>
      {/* Texte animé positionné par-dessus */}
      <Box component="span" sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {displayed}
        {isTyping && cursor}
      </Box>
    </Typography>
  )
}
