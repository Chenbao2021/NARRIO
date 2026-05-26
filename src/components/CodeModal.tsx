import { useState, useEffect, useCallback, KeyboardEvent, JSX } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface CodeModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  expectedCode: string
}

export default function CodeModal({
  open,
  onClose,
  onConfirm,
  expectedCode,
}: CodeModalProps): JSX.Element {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    if (open) {
      setInput('')
      setError(false)
    }
  }, [open])

  const handleConfirm = useCallback(() => {
    if (input === expectedCode) {
      setError(false)
      onConfirm()
    } else {
      setError(true)
      setShakeKey((k) => k + 1)
    }
  }, [input, expectedCode, onConfirm])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleConfirm()
    },
    [handleConfirm],
  )

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableScrollLock
      PaperProps={{
        sx: {
          border: '2px solid #2d2d2d',
          borderRadius: '4px 12px 8px 4px',
          boxShadow: '5px 5px 0 rgba(0,0,0,0.12)',
          background: '#fffef9',
          minWidth: 300,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: '"Caveat", cursive',
          fontSize: '1.6rem',
          pb: 0,
        }}
      >
        {t('code.title')}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box
          key={shakeKey}
          sx={{ animation: error ? 'shake 0.5s ease' : 'none' }}
        >
          <TextField
            autoFocus
            label="Code"
            fullWidth
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              if (error) setError(false)
            }}
            onKeyDown={handleKeyDown}
            error={error}
            helperText={error ? t('code.error') : ''}
            variant="outlined"
            sx={{
              mt: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px 8px 6px 4px',
                fontFamily: '"Nunito", sans-serif',
              },
            }}
          />
        </Box>
        {error && (
          <Typography
            sx={{
              fontFamily: '"Caveat", cursive',
              fontSize: '1rem',
              color: '#9ca3af',
              mt: 1,
              textAlign: 'center',
            }}
          >
            {t('code.hint')}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color: '#6b7280', borderColor: '#d1d5db' }}
        >
          {t('code.cancel')}
        </Button>
        <Button variant="contained" onClick={handleConfirm}>
          {t('code.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
