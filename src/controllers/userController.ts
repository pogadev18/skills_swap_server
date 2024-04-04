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
  console.log(`Starting process to create or update skill for user ${userId}`)

  try {
    console.log(`Upserting skill: ${skillData.name}`)
    // Find or create the Skill
    let skill = await prisma.skill.upsert({
      where: { name: skillData.name },
      create: { name: skillData.name },
      update: {}
    })
    console.log(`Upserted skill: ${skill.id}`)

    console.log(`Upserting user skill for user ${userId} and skill ${skill.id}`)
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
    console.log(`Upserted user skill for user ${userId}`)

    // Process tags
    console.log(`Processing tags for skill ${skill.id}`)
    for (const tagName of skillData.tags) {
      console.log(`Upserting tag: ${tagName}`)
      await prisma.tag.upsert({
        where: { name: tagName },
        create: { name: tagName, skills: { connect: { id: skill.id } } },
        update: {}
      })
      console.log(`Upserted tag: ${tagName}`)
    }
    console.log(`Processed all tags for skill ${skill.id}`)

    console.log(`Finished process for user ${userId}`)
  } catch (error) {
    console.error('Error during createOrUpdateUserSkill:', error)
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
    console.error(error)
    res.status(500).json({ error: 'Internal server error.' })
  }
}
