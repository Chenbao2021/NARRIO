import { useState, useEffect, useCallback, JSX } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface QuizModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  choices: string[]
  correctAnswer: number
}

export default function QuizModal({
  open,
  onClose,
  onConfirm,
  choices,
  correctAnswer,
}: QuizModalProps): JSX.Element {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number | null>(null)
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  useEffect(() => {
    if (open) {
      setSelected(null)
      setError(false)
    }
  }, [open])

  const handleConfirm = useCallback(() => {
    if (selected === null) return
    if (selected === correctAnswer) {
      setError(false)
      onConfirm()
    } else {
      setError(true)
      setShakeKey((k) => k + 1)
    }
  }, [selected, correctAnswer, onConfirm])

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
        {t('quiz.title')}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box
          key={shakeKey}
          sx={{ animation: error ? 'shake 0.5s ease' : 'none' }}
        >
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={selected === null ? '' : String(selected)}
              onChange={(e) => {
                setSelected(Number(e.target.value))
                if (error) setError(false)
              }}
            >
              {choices.map((choice, i) => (
                <FormControlLabel
                  key={i}
                  value={String(i)}
                  control={
                    <Radio
                      sx={{
                        color: error && selected === i ? '#ef4444' : undefined,
                        '&.Mui-checked': {
                          color: error && selected === i ? '#ef4444' : '#ca8a04',
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      sx={{
                        fontFamily: '"Nunito", sans-serif',
                        fontSize: '1rem',
                        color: error && selected === i ? '#ef4444' : 'inherit',
                      }}
                    >
                      {choice}
                    </Typography>
                  }
                  sx={{
                    mb: 0.5,
                    borderRadius: '6px',
                    px: 1,
                    border: '1px solid',
                    borderColor:
                      error && selected === i
                        ? '#ef4444'
                        : selected === i
                          ? '#ca8a04'
                          : 'transparent',
                    transition: 'border-color 0.2s',
                  }}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {error && (
          <Typography
            sx={{
              fontFamily: '"Caveat", cursive',
              fontSize: '1rem',
              color: '#ef4444',
              mt: 1,
              textAlign: 'center',
            }}
          >
            {t('quiz.error')}
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ color: '#6b7280', borderColor: '#d1d5db' }}
        >
          {t('quiz.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={selected === null}
        >
          {t('quiz.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
