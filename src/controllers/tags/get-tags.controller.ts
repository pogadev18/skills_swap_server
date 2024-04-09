import type { Request, Response } from 'express'
import { getTags } from './tag.dao'

export const getTagsController = async (req: Request, res: Response) => {
  try {
    const tags = await getTags()
    res.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
