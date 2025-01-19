import { trackClientId } from '@/constants'

export class TraktService {
  private static traktApiBaseUri = 'https://api.trakt.tv'

  static sendTraktGetRequest = async <T>(uri: string, accesstoken: string) => {
    const response = await fetch(`${TraktService.traktApiBaseUri}${uri}`, {
      headers: TraktService.getDefaultHeaders(accesstoken),
    })
    const value = (await response.json()) as T
    return value
  }

  private static getDefaultHeaders = (accesstoken: string) => {
    return {
      'trakt-api-version': '2',
      'trakt-api-key': trackClientId,
      Authorization: accesstoken,
    }
  }
}
