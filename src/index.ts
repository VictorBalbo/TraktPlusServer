import 'module-alias/register';
import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import { port } from './constants'
import { TraktController } from './Controllers/TraktController'
import { TmdbController } from './Controllers/TmdbController'
import { MediaController } from './Controllers/MediaController'

export const App: Express = express()

// Middlewares
App.use(express.json())
App.use(cors())

App.use(MediaController)
App.use(TraktController)
App.use(TmdbController)

App.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

App.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`)
})
