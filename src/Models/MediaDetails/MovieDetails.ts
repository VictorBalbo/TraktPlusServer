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
  language: string
  genres: string[]
  certification: string
}
