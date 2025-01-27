import { TraktContentResponse } from "."

export interface Trending extends TraktContentResponse{
  watchers: number
}