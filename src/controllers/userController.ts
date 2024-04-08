import type { Request, Response } from 'express'
import { z, ZodError } from 'zod'

import prisma from '../utils/prisma'

const UserSchema = z.object({
  bio: z
    .string()
    .min(20, { message: 'Bio must be at least 20 characters long.' }),
  meetingPreferance: z // it can be "online" " in-person" or "hybrid"
    .string()
    .min(5, { message: 'Location must be at least 5 characters long.' }),
  availability: z
    .string()
    .min(2, { message: 'Availability must be at least 2 characters long.' })
})

type SkillData = {
  skillId: string
  isOffered: boolean
  weight: number
  tagIds: string[]
}

/*
TO TAKE INTO CONSIDERATION:
- "updateSkillTags": Assuming I want to replace the tags associated with a skill every
time I update a user's skill. This logic might suffer changes depending on the requirements
of the application.

- The repeated calls to prisma.skill.update and prisma.userSkill.upsert within loops
are fine for low volumes of data but I should consider the potential impact on performance and
rate limits for the database if / when scaling up. If I anticipate a high volume of concurrent
updates, I might need to explore batching these operations or other optimization strategies.
*/

/*

TODOS:
- use zod to validate the payload of the updateUserSkills request
- scenarios to test:
  1. update existing skills with different isOffered, weight, or tagIds
  2. remove all tags from a skill to ensure the clear and connect logic works as expected
  3. handling and gracefully responding to invalid skillId or tagIds

*/
async function updateSkillTags(skillId: string, tagIds: string[]) {
  // disconnect all current tags associated with the skill
  await prisma.skill.update({
    where: { id: skillId },
    data: {
      tags: {
        set: [] // This clears out the current tags
      }
    }
  })

  // Then, connect the new tags
  await prisma.skill.update({
    where: { id: skillId },
    data: {
      tags: {
        connect: tagIds.map((id) => ({ id }))
      }
    }
  })
}

async function createOrUpdateUserSkill(userId: string, skillData: SkillData) {
  try {
    console.log(`Linking skill to user: ${userId}`)

    // Link the UserSkill
    await prisma.userSkill.upsert({
      where: { userId_skillId: { userId, skillId: skillData.skillId } },
      create: {
        userId,
        skillId: skillData.skillId,
        isOffered: skillData.isOffered,
        weight: skillData.weight
      },
      update: {
        isOffered: skillData.isOffered,
        weight: skillData.weight
      }
    })

    // After upserting UserSkill, update the tags associated with the skill
    await updateSkillTags(skillData.skillId, skillData.tagIds)

    console.log(`Linked skill for user ${userId}`)
  } catch (error) {
    console.error('Error during linking skill to user:', error)
    throw error
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: clerkUserId
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found.' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error.' })
  }
}

export const updateUseProfile = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId

  try {
    const parsedBody = UserSchema.safeParse(req.body)

    if (!parsedBody.success) {
      return res.status(400).json({ errors: parsedBody.error.errors })
    }

    const user = await prisma.user.update({
      where: {
        clerkId: clerkUserId
      },
      data: {
        bio: parsedBody.data.bio,
        meetingPreferance: parsedBody.data.meetingPreferance,
        availability: parsedBody.data.availability
      }
    })

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

export const updateUserSkills = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId as string
  const skills: SkillData[] = req.body.skills

  try {
    for (const skillData of skills) {
      await createOrUpdateUserSkill(clerkUserId, skillData)
    }

    res.status(200).json({ message: 'Skills updated successfully.' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
