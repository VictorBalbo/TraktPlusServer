import { Ids } from "@/Models"

export interface Recommendation {
  type: string
  show?: Content
  movie?: Content
}

export interface Content {
  title: string
  year: number
  ids: Ids
}