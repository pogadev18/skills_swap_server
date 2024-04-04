import type { Request, Response } from 'express'
import { z, ZodError } from 'zod'

import prisma from '../utils/prisma'

const UserSchema = z.object({
  bio: z
    .string()
    .min(20, { message: 'Bio must be at least 20 characters long.' }),
  location: z // it can be "online" " in-person" or "hybrid"
    .string()
    .min(5, { message: 'Location must be at least 5 characters long.' }),
  availability: z
    .string()
    .min(2, { message: 'Availability must be at least 2 characters long.' })
})

type SkillData = {
  name: string
  isOffered: boolean
  weight: number
  tags: string[]
}

async function createOrUpdateUserSkill(userId: string, skillData: SkillData) {
  // Find or create the Skill
  const skill = await prisma.skill.upsert({
    // @ts-ignore -> todo: fix this
    where: { name: skillData.name },
    create: { name: skillData.name },
    update: {}
  })

  // Create or update the UserSkill
  await prisma.userSkill.upsert({
    where: {
      userId_skillId: {
        userId,
        skillId: skill.id
      }
    },
    create: {
      userId,
      skillId: skill.id,
      isOffered: skillData.isOffered,
      weight: skillData.weight
      // isActive could be set elsewhere, e.g., when a match is made
    },
    update: {
      isOffered: skillData.isOffered,
      weight: skillData.weight
      // isActive if needed
    }
  })

  // process tags
  for (const tagName of skillData.tags) {
    await prisma.tag.upsert({
      where: { name: tagName },
      create: { name: tagName, skills: { connect: { id: skill.id } } },
      update: {}
    })
  }
}

export const getUserProfile = async (req: Request, res: Response) => {
  const clerkUserId = req.params.userId

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: clerkUserId
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
        id: clerkUserId
      },
      data: {
        bio: parsedBody.data.bio,
        location: parsedBody.data.location,
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
    res.status(500).json({ error: 'Internal server error.' })
  }
}
