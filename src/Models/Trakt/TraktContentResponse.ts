import { Content } from "."

export interface TraktContentResponse {
  type?: string
  show?: Content
  movie?: Content
}