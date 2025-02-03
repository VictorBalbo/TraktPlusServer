import { Router } from 'express'
import { MediaService } from '../Services'
import { MediaType } from '../Models'

export const MediaController = Router()

const recommendationsUri = '/recommendations'
MediaController.get(recommendationsUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  const recommendations = await MediaService.getRecommendations(accessToken)
  res.json(recommendations)
})

const moviesTrendingUri = '/:type/trending'
MediaController.get(moviesTrendingUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  let type

  if (req.params.type === MediaType.Movie) {
    type = MediaType.Movie
  } else if (req.params.type === MediaType.Show) {
    type = MediaType.Show
  } else {
    res.status(400).send('Type must be "movies" or "shows"')
    return
  }
  const recommendations = await MediaService.getTrending(accessToken, type)
  res.json(recommendations)
})

const upNextUri = '/upnext'
MediaController.get(upNextUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''

  const recommendations = await MediaService.getUpNextShows(accessToken)
  res.json(recommendations)
})

const watchlistUri = '/watchlist'
MediaController.get(watchlistUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''

  const recommendations = await MediaService.getWatchlist(accessToken)
  res.json(recommendations)
})

const movieDetailtUri = '/movie/:id'
const showDetailtUri = '/show/:id/'
const seasonDetailtUri = '/season/:id/:seasonId'
const episodeDetailtUri = '/episode/:id/:seasonId/:episodeId'
MediaController.get(movieDetailtUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  const mediaId = req.params.id
  const movie = await MediaService.getMovieDetail(accessToken, mediaId)
  res.json(movie)
})
