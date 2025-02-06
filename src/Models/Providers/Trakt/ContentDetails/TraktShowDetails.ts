import { ShowStatus } from '../../../MediaDetails/ShowDetails'
import { Content, TraktSeasonDetails } from '..'

export interface TraktShowDetails extends Content {
  tagline: string
  overview: string
  first_aired?: string
  airs: Airs
  runtime: number
  certification: string
  network: string
  country: string
  trailer: string
  homepage: string
  status: ShowStatus
  rating: number
  votes: number
  comment_count: number
  updated_at: string
  language: string
  languages: string[]
  genres: string[]
  aired_episodes: number
  seasons?: TraktSeasonDetails[]
}

interface Airs {
  day: string
  time: string
  timezone: string
}
