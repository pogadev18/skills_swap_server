import type { Request, Response } from 'express'

import { getUser } from './user.dao'

export const getUserController = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId

  try {
    const user = await getUser(clerkUserId)

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' })
  }
}
