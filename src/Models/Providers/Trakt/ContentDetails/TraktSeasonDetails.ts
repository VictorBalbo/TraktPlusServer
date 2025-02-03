import { Content } from '..'

export interface TraktSeasonDetails extends Content {
  number: number
  rating: number
  votes: number
  episode_count: number
  aired_episodes: number
  overview?: string
  first_aired: string
  updated_at: string
  network: string
}
