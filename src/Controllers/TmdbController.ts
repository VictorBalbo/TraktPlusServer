import { Router } from 'express'
import { GetConfigurationsResponse, GetImagesResponse } from '@/Models/TMDB'
import { tmdbAccessToken } from '@/constants'

export const TmdbController = Router()

let tmdbImagesUri: string
let tmdbApiBaseUri = 'https://api.themoviedb.org/3'

const getImagesUri = async () => {
  if (tmdbImagesUri) {
    return tmdbImagesUri
  }

  const url = `${tmdbApiBaseUri}/configuration`
  const options = getRequestOptions()

  try {
    const response = await fetch(url, options)
    const config = (await response.json()) as GetConfigurationsResponse
    tmdbImagesUri = config.images.base_url
  } catch (e) {
    console.error(e)
  }
}

const movieImageUri = '/image/:type/:id'
TmdbController.get(movieImageUri, async (req, res, next) => {
  const type = req.params.type.toLocaleLowerCase()
  if (type !== 'movie' && type !== 'tv') {
    res.status(400).send('Invalid content type. Content must be Movie or TV.')
    return
  }

  const url = `${tmdbApiBaseUri}/${type}/${req.params.id}/images`
  const options = getRequestOptions()

  try {
    const response = await fetch(url, options)
    const images = (await response.json()) as GetImagesResponse
    res.json(images)
  } catch (e) {
    console.error(e)
  }
})

const getRequestOptions = () => {
  return {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${tmdbAccessToken}`,
    },
  }
}
