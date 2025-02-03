import { Ids, Media, MediaImages, WatchProvider } from '.'

export interface ShowDetails extends Media {
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
  aired_episodes: number,
  seasons?: Season[]
  providers?: WatchProvider[]
}

interface Airs {
  day: string
  time: string
  timezone: string
}

export interface Season {
  number: number
  title: string
  ids: Ids
  images?: MediaImages
  rating: number
  votes: number
  episode_count: number
  aired_episodes: number
  overview?: string
  first_aired: string
  updated_at: string
  network: string
}