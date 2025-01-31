import { Ids } from "../Ids"

export interface ShowProgress {
  aired: number
  completed: number
  last_watched_at: Date
  seasons: Season[]
  next_episode: FollowingEpisode
  last_episode: FollowingEpisode
}

interface Season {
  number: number
  title: any
  aired: number
  completed: number
  episodes: Episode[]
}

interface Episode {
  number: number
  completed: boolean
  last_watched_at?: string
}

interface FollowingEpisode {
  season: number
  number: number
  title: string
  ids: Ids
}