import type { Request, Response } from 'express'

import prisma from '../utils/prisma'

export const getAllSkills = async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        tags: true // Include associated tags in the response
      }
    })
    res.json(skills)
  } catch (error) {
    console.error('Error fetching skills:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
