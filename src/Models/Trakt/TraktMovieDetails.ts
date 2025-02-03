import { Ids } from "../Ids"

export interface TraktMovieDetails {
  title: string
  year: number
  ids: Ids
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
  available_translations: string[]
  genres: string[]
  certification: string
}