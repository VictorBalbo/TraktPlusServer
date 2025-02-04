export interface GetProvidersByMediaName {
  data: {
    popularTitles: {
      edges: [
        {
          node: {
            objectType: string
            content: Content
            offers: Offer[]
          }
        },
      ]
    }
  }
}

interface Content {
  fullPath: string
  title: string
  externalIds: ExternalIds
  scoring: Scorings
}

interface ExternalIds {
  imdbId: string
}

interface Scorings {
  imdbScore: number
  imdbVotes: number
  tmdbScore: number
  jwRating: number
  tomatoMeter: number
  certifiedFresh?: boolean
}

interface Offer {
  monetizationType: string
  presentationType: string
  standardWebURL: string
  elementCount: number
  package: Package
}

interface Package {
  packageId: number
  clearName: string
  icon: string
}
