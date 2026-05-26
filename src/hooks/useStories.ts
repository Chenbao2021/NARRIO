import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { storiesMeta, Story } from '../data/stories'

export function useStories(): Story[] {
  const { t } = useTranslation()
  return useMemo(
    () =>
      storiesMeta.map((meta) => ({
        ...meta,
        title: t(`stories.${meta.id}.title`),
        subtitle: t(`stories.${meta.id}.subtitle`),
        intro: t(`stories.${meta.id}.intro`),
        levels: meta.levels.map((level) => ({
          ...level,
          title: t(`stories.${meta.id}.levels.${level.id}.title`),
          description: t(`stories.${meta.id}.levels.${level.id}.description`),
        })),
      })),
    // t changes reference when language changes, triggering recompute
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  )
}
