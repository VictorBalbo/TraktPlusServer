import { GetProvidersByMediaName } from 'src/Models/JustWatch'
import { WatchProvider } from 'src/Models/WatchProvider'

export class JustWatchService {
  private static API_URL = 'https://apis.justwatch.com/graphql'
  static searchMediaProviders = async (mediaSlug: string, imdbId: string) => {
    const query = `
    query GetProvidersByName(
      $country: Country!
      $language: Language!
      $first: Int!
      $filter: TitleFilter
    ) {
      popularTitles(country: $country, first: $first, filter: $filter) {
        edges {
          node {
            ...SuggestedTitle
          }
        }
      }
    }

    fragment SuggestedTitle on MovieOrShow {
      objectType
      content(country: $country, language: $language) {
        fullPath
        title
        externalIds {
          imdbId
        }
      }
      offers(
        country: $country
        platform: WEB
        filter: { preAffiliate: true, bestOnly: true }
      ) {
        monetizationType
        presentationType
        standardWebURL
        elementCount
        package {
          packageId
          clearName
          icon
        }
      }
    }`
    const variables = {
      country: 'BR',
      language: 'en',
      first: 4,
      filter: {
        searchQuery: mediaSlug,
        includeTitlesWithoutUrl: true,
      },
    }
    const response = await fetch(JustWatchService.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    })
    const medias = (await response.json()) as GetProvidersByMediaName
    const media = medias.data.popularTitles.edges.find(
      (m) => m.node.content.externalIds.imdbId === imdbId,
    )
    if (!media) {
      return
    }
    
    const watchProvider = media.node.offers.map(m => {
      const provider: WatchProvider = {
        monetizationType: m.monetizationType,
        providerUri: m.standardWebURL,
        elementCount: m.elementCount,
        qualityType: m.presentationType.replace('_', ''),
        provider: {
          id: m.package.packageId,
          name: m.package.clearName,
          icon: m.package.icon,
        }
      }
      return provider
    })
    return watchProvider
  }
}
