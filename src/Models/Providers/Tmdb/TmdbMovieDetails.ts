import { TmdbMediaDetails } from '.'

export interface TmdbMovieDetails extends TmdbMediaDetails {
  belongs_to_collection: any
  budget: number
  homepage: string
  imdb_id: string
  origin_country: string[]
  original_language: string
  original_title: string
  popularity: number
  release_date: string
  revenue: number
  runtime: number
  status: string
  title: string
  vote_average: number
  vote_count: number
  release_dates: ReleaseDates
}

interface ReleaseDates {
  results: ReleaseResult[]
}

interface ReleaseResult {
  iso_3166_1: string
  release_dates: ReleaseDate[]
}

interface ReleaseDate {
  certification: string
  descriptors: string[]
  iso_639_1: string
  note: string
  release_date: string
  type: number
}
