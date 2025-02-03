import { Media } from '..'

export interface MovieDetails extends Media {
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
  language: string
  genres: string[]
  certification: string
}
