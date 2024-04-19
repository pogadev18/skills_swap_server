import type { Request, Response } from 'express'
import { z, ZodError } from 'zod'

import { updateUserBiograpghy } from './user.dao'

const UserBioSchema = z.object({
  bio: z
    .string()
    .min(20, { message: 'Bio must be at least 20 characters long.' }),
  meetingPreferance: z.enum(['online', 'in-person', 'hybrid']),
  availability: z
    .string()
    .min(2, { message: 'Availability must be at least 2 characters long.' })
})

export type UserBioData = z.infer<typeof UserBioSchema> // todo: use from Prisma Client?

export const putUserBiographyController = async (
  req: Request,
  res: Response
) => {
  const clerkUserId = req.params.userId

  try {
    const parsedBody = UserBioSchema.safeParse(req.body)

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors })
    }

    const user = await updateUserBiograpghy(clerkUserId, parsedBody.data)

    res.status(200).json(user)
  } catch (error) {
    if (error instanceof ZodError) {
      // Respond with a 400 error if validation fails
      return res.status(400).json({ errors: error.errors })
    }
    // Handle unexpected errors
    res.status(500).json({ error: 'Internal server error.' })
  }
}
