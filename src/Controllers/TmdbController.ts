import { Router } from 'express'
import { MediaType } from '../Models'
import { TmdbService } from '../Services'

export const TmdbController = Router()

const movieImageUri = '/images/:type/:id'
TmdbController.get(movieImageUri, async (req, res, next) => {
  const type = req.params.type.toLocaleLowerCase() as MediaType
  const id = parseInt(req.params.id)
  
  if(!Object.values(MediaType).includes(type as MediaType)) {
      res.status(400).send('Invalid content type. Content must be Movie or Show.')
      return
  } 
  const images = await TmdbService.getMediaImages(id, type)
  res.json(images)
})