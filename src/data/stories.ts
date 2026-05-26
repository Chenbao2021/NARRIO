export interface LevelMeta {
  id: number
  code?: string
}

export interface StoryMeta {
  id: number
  colorKey: 'yellow' | 'blue' | 'green' | 'pink'
  emoji: string
  levels: LevelMeta[]
}

// Full story shape (returned by useStories hook with translations applied)
export interface Level {
  id: number
  title: string
  description: string
  code?: string
}

export interface Story {
  id: number
  title: string
  subtitle: string
  intro: string
  levels: Level[]
  colorKey: 'yellow' | 'blue' | 'green' | 'pink'
  emoji: string
}

export const storiesMeta: StoryMeta[] = [
  {
    id: 1,
    colorKey: 'yellow',
    emoji: '📗',
    levels: [{ id: 1 }, { id: 2, code: '42' }, { id: 3 }],
  },
  {
    id: 2,
    colorKey: 'blue',
    emoji: '⌚',
    levels: [{ id: 1 }, { id: 2, code: '83' }, { id: 3 }],
  },
  {
    id: 3,
    colorKey: 'green',
    emoji: '🖼️',
    levels: [{ id: 1 }, { id: 2, code: '29' }, { id: 3 }],
  },
  {
    id: 4,
    colorKey: 'pink',
    emoji: '🌙',
    levels: [{ id: 1 }, { id: 2, code: '56' }, { id: 3 }],
  },
  {
    id: 5,
    colorKey: 'yellow',
    emoji: '💎',
    levels: [{ id: 1 }, { id: 2, code: '17' }, { id: 3 }],
  },
  {
    id: 6,
    colorKey: 'blue',
    emoji: '📜',
    levels: [{ id: 1 }, { id: 2, code: '64' }, { id: 3 }],
  },
]
