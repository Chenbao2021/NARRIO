import { JSX } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

interface HelpModalProps {
  open: boolean
  onClose: () => void
  helpText?: string
}

export default function HelpModal({
  open,
  onClose,
  helpText,
}: HelpModalProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      disableScrollLock
      PaperProps={{
        sx: {
          border: '2px solid #2d2d2d',
          borderRadius: '8px 4px 12px 4px',
          boxShadow: '5px 5px 0 rgba(0,0,0,0.12)',
          background: '#fffef9',
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: '"Caveat", cursive', fontSize: '1.6rem', pb: 0 }}>
        {t('help.title')}
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="body2"
          sx={{ fontFamily: '"Nunito", sans-serif', whiteSpace: 'pre-line', mt: 1 }}
        >
          {helpText ?? t('help.default')}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose}>
          {t('help.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
