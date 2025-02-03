import { trackClientId } from '../constants'

export class TraktService {
  private static traktApiBaseUri = 'https://api.trakt.tv'

  static sendTraktGetRequest = async <T>(uri: string, accesstoken: string) => {
    const response = await fetch(`${TraktService.traktApiBaseUri}${uri}`, {
      headers: TraktService.getDefaultHeaders(accesstoken),
    })
    if(response.ok) {
      const value = await response.json()
      return value as T
    } else {
      throw new Error(`Error on sending command to Trakt. Code: ${response.status} - Message: ${response.statusText}`)
    }
  }

  private static getDefaultHeaders = (accesstoken: string) => {
    return {
      'trakt-api-version': '2',
      'trakt-api-key': trackClientId,
      Authorization: accesstoken,
    }
  }
}
