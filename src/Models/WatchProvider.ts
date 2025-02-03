export interface WatchProvider {
  monetizationType: string
  qualityType: string
  providerUri: string
  elementCount: number
  provider: Provider
}

interface Provider {
  id: number
  name: string
  icon: string
}