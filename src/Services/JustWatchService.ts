import { MediaType } from 'src/Models'
import { GetProvidersByMediaName } from 'src/Models/Providers/JustWatch'
import { WatchProvider } from 'src/Models/WatchProvider'

export class JustWatchService {
  private static API_URL = 'https://apis.justwatch.com/graphql'
  static searchMediaProviders = async (
    mediaSlug: string,
    mediaType: MediaType,
    imdbId?: string | null,
  ) => {
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
        scoring {
          imdbScore
          imdbVotes
          tmdbScore
          jwRating
          tomatoMeter
          certifiedFresh
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
          icon(profile: S100, format: PNG)
        }
      }
    }`
    const variables = {
      country: 'BR',
      language: 'en',
      first: 10,
      filter: {
        searchQuery: mediaSlug,
        includeTitlesWithoutUrl: true,
        objectTypes: [mediaType.toUpperCase()],
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
      return {}
    }

    const watchProviders = media.node.offers.map((m) => {
      const provider: WatchProvider = {
        monetizationType: m.monetizationType,
        providerUri: m.standardWebURL,
        elementCount: m.elementCount,
        qualityType: m.presentationType.replace('_', ''),
        provider: {
          id: m.package.packageId,
          name: m.package.clearName,
          icon: m.package.icon,
        },
      }
      return provider
    })
    return {
      watchProviders,
      scorings: media.node.content.scoring,
      justWatchId: media.node.content.fullPath,
    }
  }
}
