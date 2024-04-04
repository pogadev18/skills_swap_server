import type { Request, Response } from 'express'

import prisma from '../utils/prisma'

export const getAllTags = async (req: Request, res: Response) => {
  try {
    const tags = await prisma.tag.findMany({})
    res.json(tags)
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
