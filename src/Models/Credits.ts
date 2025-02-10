import { z } from 'zod'
import { IdsSchema } from './Ids'

const CastCrewMemberSchema = z.object({
  characters: z.array(z.string()).optional(),
  jobs: z.array(z.string()).optional(),
  episode_count: z.number().optional(),
  person: z.object({
    name: z.string(),
    ids: IdsSchema,
  }),
  images: z.object({
    headshot: z.array(z.string()),
  }),
})

export const CreditsSchema = z.object({
  cast: z.array(CastCrewMemberSchema),
  crew: z.object({
    directing: z.array(CastCrewMemberSchema).optional(),
    writing: z.array(CastCrewMemberSchema).optional(),
    'created by': z.array(CastCrewMemberSchema).optional(),
  }),
})

export type Credits = z.infer<typeof CreditsSchema>
