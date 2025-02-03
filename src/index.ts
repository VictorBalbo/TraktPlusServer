import express, { Express, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { port } from './constants'
import { MediaController, TmdbController, TraktController } from './Controllers'
import { oAuthTokenUri } from './Controllers/TraktController'

export const App: Express = express()

// Middlewares
App.use(express.json())
App.use(cors())
const checkAuthHeaderMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/oauth/token/')) {
    next()
  } else if (req.headers.authorization) {
    next()
  } else {
    res.status(401).send('No Authorization header sent')
  }
}
App.use(checkAuthHeaderMiddleware)

App.use(MediaController)
App.use(TraktController)
App.use(TmdbController)

App.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

App.listen(port, () => {
  console.log(`[Server]: Server is running at http://localhost:${port}`)
})
