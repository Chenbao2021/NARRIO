import { useState, JSX } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material'
import QRCode from 'react-qr-code'
import { useTranslation } from 'react-i18next'

interface QRModalProps {
  open: boolean
  onClose: () => void
  storyId: string
}

export default function QRModal({ open, onClose, storyId }: QRModalProps): JSX.Element {
  const { t } = useTranslation()
  const url = `${window.location.origin}/story/${storyId}`
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

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
          minWidth: 280,
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
        {t('qr.title')}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
          <QRCode value={url} size={200} />
        </Box>
        <Typography
          sx={{
            fontFamily: '"Nunito", sans-serif',
            fontSize: '0.9rem',
            color: '#9ca3af',
            textAlign: 'center',
            mb: 2,
          }}
        >
          {t('qr.description')}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            border: '1.5px solid #e5e7eb',
            borderRadius: '4px 8px 6px 4px',
            px: 1.5,
            py: 0.75,
            background: '#f9fafb',
          }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={handleCopy}
            sx={{
              flexShrink: 0,
              fontFamily: '"Nunito", sans-serif',
              fontSize: '0.75rem',
              py: 0.25,
              px: 1,
              borderColor: copied ? '#059669' : '#d1d5db',
              color: copied ? '#059669' : '#6b7280',
              minWidth: 'unset',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? t('qr.copied') : t('qr.copy')}
          </Button>
          <Typography
            sx={{
              fontFamily: '"Nunito", sans-serif',
              fontSize: '0.75rem',
              color: '#9ca3af',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}
          >
            {url}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="contained" onClick={onClose} fullWidth>
          {t('qr.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
