import { trackClientId, trackClientSecret, trackRedirectUrl } from '../constants'
import { oAuth } from '../Models/Providers/Trakt'
import { Router } from 'express'
export const TraktController = Router()

const traktApiBaseUri = 'https://api.trakt.tv'

export const oAuthTokenUri = '/oauth/token/:code'
TraktController.post(oAuthTokenUri, async (req, res, next) => {
  try {
    const code = req.params.code
    const redirectUri = req.query.redirect_uri
    const responsePromise = await fetch(`${traktApiBaseUri}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: trackClientId,
        client_secret: trackClientSecret,
        redirect_uri: redirectUri ?? trackRedirectUrl,
      }),
    })
    const oAuth = await responsePromise.json() as oAuth
		res.status(responsePromise.status).json(oAuth)
	} catch (e) {
		next(e)
	}
})

