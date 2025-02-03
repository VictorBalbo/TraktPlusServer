import { EpisodeDetails } from './EpisodeDetails'
import { Media } from '..'

export interface SeasonDetails extends Media {
  number: number
  rating: number
  votes: number
  episode_count: number
  aired_episodes: number
  overview?: string
  first_aired: string
  network: string
  episodes?: EpisodeDetails[]
}