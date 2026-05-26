import { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { IconButton } from '@mui/material'

export default function LanguageSwitcher(): JSX.Element {
  const { i18n } = useTranslation()
  const isZh = i18n.language?.startsWith('zh')

  return (
    <IconButton
      onClick={() => i18n.changeLanguage(isZh ? 'fr' : 'zh')}
      size="small"
      aria-label={isZh ? 'Passer en français' : '切换为中文'}
      sx={{
        position: 'fixed',
        top: 12,
        right: 16,
        zIndex: 1300,
        fontSize: '1.4rem',
        borderRadius: '4px 8px 4px 8px',
        border: '1.5px solid #2d2d2d',
        background: '#fffef9',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.10)',
        lineHeight: 1,
        '&:hover': {
          background: '#fef9c3',
          transform: 'translateY(-2px)',
          boxShadow: '3px 3px 0 rgba(0,0,0,0.14)',
        },
        transition: 'all 0.15s ease',
      }}
    >
      {isZh ? '🇫🇷' : '🇨🇳'}
    </IconButton>
  )
}
