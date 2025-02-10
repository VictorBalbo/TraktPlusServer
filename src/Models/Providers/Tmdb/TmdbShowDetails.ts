import { TmdbSeasonDetails } from "."

export interface TmdbShowDetails {
  id: number
  name: string
  adult: boolean
  backdrop_path: string
  created_by: CreatedBy[]
  episode_run_time: any[]
  first_air_date: string
  genres: Genre[]
  homepage: string
  in_production: boolean
  languages: string[]
  last_air_date: string
  last_episode_to_air: EpisodeToAir
  next_episode_to_air: EpisodeToAir
  networks: Network[]
  number_of_episodes: number
  number_of_seasons: number
  origin_country: string[]
  original_language: string
  original_name: string
  overview: string
  popularity: number
  poster_path: string
  seasons: TmdbSeasonDetails[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string
  type: string
  vote_average: number
  vote_count: number
  videos: {
    results: VideoResult[]
  }
}

interface CreatedBy {
  id: number
  credit_id: string
  name: string
  original_name: string
  gender: number
  profile_path: string
}

interface Genre {
  id: number
  name: string
}

interface EpisodeToAir {
  id: number
  name: string
  overview: string
  vote_average: number
  vote_count: number
  air_date: string
  episode_number: number
  episode_type: string
  production_code: string
  runtime: number
  season_number: number
  show_id: number
  still_path: string
}

interface Network {
  id: number
  logo_path: string
  name: string
  origin_country: string
}

interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

interface VideoResult {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}
