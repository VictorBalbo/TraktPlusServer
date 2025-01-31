import { Content } from "./Content"

export interface WatchedShow {
  plays: number
  last_watched_at: Date
  last_updated_at: Date
  show: Content
  seasons: Season[]
}

interface Season {
  number: number
  episodes: Episode[]
}

interface Episode {
  number: number
  plays: number
  last_watched_at: Date
}
