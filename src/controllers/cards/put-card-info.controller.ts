import type { Request, Response } from 'express'

import { updateCardInfo } from './card.dao'
import type { UserCard } from '@prisma/client'

export const putUserCardController = async (req: Request, res: Response) => {
  const { userId } = req.params
  const { isActive, shareableLink } = req.body as Pick<
    UserCard,
    'isActive' | 'shareableLink'
  >

  try {
    await updateCardInfo(userId, { isActive, shareableLink })

    res.status(200).json({ message: 'Card updated successfully' })
  } catch (error) {
    console.error('Error updating user card:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
