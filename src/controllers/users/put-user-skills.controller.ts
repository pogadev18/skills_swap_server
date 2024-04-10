import type { Request, Response } from 'express'
import { updateUserSkill } from './user.dao'

export type SkillData = {
  skillId: string
  isOffered: boolean
  weight: number
  tagIds: string[]
}

export const putUserSkillsController = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId as string
  const skills: SkillData[] = await req.body

  try {
    const notOfferedSkills = skills.filter((skill) => !skill.isOffered)

    if (notOfferedSkills.length === skills.length) {
      return res
        .status(400)
        .json({ error: 'At least one skill must be offered.' })
    }

    for (const skillData of skills) {
      await updateUserSkill(clerkUserId, skillData)
    }

    res.status(200).json({ message: 'Skills updated successfully.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
