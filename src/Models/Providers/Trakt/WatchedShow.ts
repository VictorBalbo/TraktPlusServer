import { Content } from "./Content"

export interface WatchedShow {
  plays: number
  last_watched_at: Date
  last_updated_at: Date
  show: Content
}