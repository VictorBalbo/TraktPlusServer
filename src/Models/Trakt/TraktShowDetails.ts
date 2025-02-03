import { Ids } from '..'

export interface TraktShowDetails {
  title: string
  year: number
  ids: Ids
  tagline: string
  overview: string
  first_aired: string
  airs: Airs
  runtime: number
  certification: string
  network: string
  country: string
  trailer: string
  homepage: string
  status: string
  rating: number
  votes: number
  comment_count: number
  updated_at: string
  language: string
  languages: string[]
  available_translations: string[]
  genres: string[]
  aired_episodes: number
  seasons?: TraktSeason[]
}

interface Airs {
  day: string
  time: string
  timezone: string
}

export interface TraktSeason {
  number: number
  ids: Ids
  rating: number
  votes: number
  episode_count: number
  aired_episodes: number
  title: string
  overview?: string
  first_aired: string
  updated_at: string
  network: string
}
