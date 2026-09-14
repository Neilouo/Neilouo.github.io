import { zh } from './zh'
import { en } from './en'

export type Language = 'zh' | 'en'

export const dictionaries: Record<Language, Record<string, string>> = { zh, en }
