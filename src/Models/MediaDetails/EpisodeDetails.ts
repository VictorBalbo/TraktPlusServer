import { Media } from '..'

export interface EpisodeDetails extends Media {
  show: string
  season: number
  number: number
  overview?: string
  first_aired?: string
  runtime?: number
  episode_type?: string
}
