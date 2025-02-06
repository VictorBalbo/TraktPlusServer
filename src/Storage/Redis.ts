import RedisDB from 'ioredis'
import { redis_url } from '../constants'
import { Media, MediaType, MovieDetails } from '../Models'

export class Redis {
  private static client?: RedisDB
  private static ttl: number = 60 * 60 * 24 // 1 day
  private static prefix: string = 'trakt-plus'

  public static getConnectionAsync = async () => {
    if (Redis.client && Redis.client.status === 'ready') {
      return Redis.client
    }

    if (Redis.client) {
      Redis.client.disconnect()
    }

    Redis.client = new RedisDB(redis_url!, {
      lazyConnect: true,
    })
    Redis.client.on('error', (error) => {
      if (error.message.includes('getaddrinfo ENOTFOUND')) {
        Redis.client?.disconnect()
      }
    })

    await Redis.client.connect()
    return Redis.client
  }

  public static findMedia = async <T>(mediaType: MediaType, mediaId: string) => {
    let media
    try {
      const redis = await Redis.getConnectionAsync()
      media = await redis.get(`${Redis.prefix}:${mediaType}:${mediaId}`)
    } catch (e) {
      console.log('Error on Find:', e)
      return undefined
    }
    if (media) {
      return JSON.parse(media) as T
    } else {
      return undefined
    }
  }

  public static saveMedia = async <T extends Media>(media: T) => {
    try {
      const redis = await Redis.getConnectionAsync()
      const movieStr = JSON.stringify(media)
      await redis.set(
        `${Redis.prefix}:${media.type}:${media.ids.trakt}`,
        movieStr,
        'EX',
        Redis.ttl,
      )

      return true
    } catch (e) {
      console.log('Error on Set:', e)
      return false
    }
  }
}
