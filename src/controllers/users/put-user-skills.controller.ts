import type { Request, Response } from 'express'
import { updateUserSkill, getAllUserSkills } from './user.dao'

export type SkillData = {
  skillId: string
  isOffered: boolean
  weight: number
  tagIds: string[]
}

export const putUserSkillsController = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId as string
  const payloadSkills: SkillData[] = req.body

  try {
    const dbUserSkills = await getAllUserSkills(clerkUserId)
    const userHasNoSkills = dbUserSkills.length === 0

    // check if there's at least one skill offered in the payload
    const isAtLeastOneSkillOffered = payloadSkills.some(
      (skill) => skill.isOffered
    )

    if (userHasNoSkills && !isAtLeastOneSkillOffered) {
      return res.status(400).json({
        error:
          'Since your profile currently has no skills listed, you must offer/teach at least one skill to submit the form. We recommend offering skills in which you are proficient and comfortable teaching.'
      })
    }

    // for users with skills, ensure there is at least one offered skill already or in the new payload
    if (
      !userHasNoSkills &&
      !isAtLeastOneSkillOffered &&
      dbUserSkills.every((skill) => !skill.isOffered)
    ) {
      return res
        .status(400)
        .json({ error: 'At least one skill must be offered.' })
    }

    // Update user skills
    await Promise.all(
      payloadSkills.map((skillData) => updateUserSkill(clerkUserId, skillData))
    )
    res.status(200).json({ message: 'Skills updated successfully.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
