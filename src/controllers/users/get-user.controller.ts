import type { Request, Response } from 'express'

import { getUser } from './user.dao'

export const getUserController = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId

  try {
    const result = await getUser(clerkUserId)

    if ('error' in result) {
      return res
        .status(result.error === 'User not found.' ? 404 : 500)
        .json(result)
    }

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' })
  }
}
