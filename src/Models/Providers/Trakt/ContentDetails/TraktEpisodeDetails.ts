import { Content } from '..'

export interface TraktEpisodeDetails extends Content {
  season: number
  number: number
  overview?: string
  rating?: number
  votes?: number
  comment_count?: number
  first_aired?: string
  runtime?: number
  episode_type?: string
}