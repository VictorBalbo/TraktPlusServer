import { TraktEpisodeDetails } from "."


export interface ShowProgress {
  aired: number
  completed: number
  last_watched_at: Date
  next_episode: TraktEpisodeDetails
  last_episode: TraktEpisodeDetails
}