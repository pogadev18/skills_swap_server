import type { Request, Response } from 'express'
import { getSkills } from './skill.dao'

export const getSkillsController = async (req: Request, res: Response) => {
  try {
    const skills = await getSkills()
    res.json(skills)
  } catch (error) {
    console.error('Error fetching tags:', error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
