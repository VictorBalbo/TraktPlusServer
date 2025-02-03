import { TraktContentResponse } from '.'

export interface WatchList extends TraktContentResponse {
  rank: number
  listed_at: Date
  notes: string
}
