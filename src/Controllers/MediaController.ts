import { Router } from 'express'
import { MediaDetailsService, MediaService } from '../Services'
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
MediaController.get(movieDetailtUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  const mediaId = req.params.id
  const movie = await MediaDetailsService.getMovieDetail(accessToken, mediaId)
  res.json(movie)
})

const showDetailtUri = '/show/:id/'
MediaController.get(showDetailtUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  const mediaId = req.params.id
  const movie = await MediaDetailsService.getShowDetail(accessToken, mediaId)
  res.json(movie)
})

const seasonDetailtUri = '/show/:id/:seasonId'
MediaController.get(seasonDetailtUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  const mediaId = req.params.id
  const seasonId = req.params.seasonId
  const movie = await MediaDetailsService.getSeasonDetail(accessToken, mediaId, seasonId)
  res.json(movie)
})
