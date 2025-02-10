import { TmdbEpisodeDetails } from "."

export interface TmdbSeasonDetails {
  air_date: string
  episode_count?: number
  episodes?: TmdbEpisodeDetails[]
  id: number
  name: string
  overview: string
  poster_path: string
  season_number: number
  vote_average: number
}