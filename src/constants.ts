import dotenv from 'dotenv'

dotenv.config()

export const port = process.env.PORT
export const trackClientId = process.env.TRAKT_CLIENT_ID ?? ''
export const trackClientSecret = process.env.TRAKT_CLIENT_SECRET ?? ''
export const trackRedirectUrl = process.env.TRAKT_REDIRECT_URL ?? ''

export const tmdbAccessToken = process.env.TMDB_ACCESS_TOKEN ?? ''
