import { Content } from '..'

export interface TraktMovieDetails extends Content {
  tagline: string
  overview: string
  released: string
  runtime: number
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
  genres: string[]
  certification: string
}
