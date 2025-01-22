import { Router } from 'express'
import { MediaService } from '../Services'

export const MediaController = Router()

const recommendationsUri = '/recommendations'
MediaController.get(recommendationsUri, async (req, res, next) => {
  const accessToken = req.headers.authorization ?? ''
  const recommendations = await MediaService.getRecommendations(accessToken)
  res.json(recommendations)
})