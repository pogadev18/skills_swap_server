import prisma from '../../utils/prisma'

import type { UserBioData } from './put-user-biography.controller'
import type { SkillData } from './put-user-skills.controller'

export async function getUser(userId: string | undefined) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId
      }
    })

    if (!user) {
      return { error: 'User not found.' }
    }

    return user
  } catch (error) {
    return { error: 'Internal server error.' }
  }
}

export async function updateUserBiograpghy(
  userId: string | undefined,
  data: UserBioData
) {
  try {
    return await prisma.user.update({
      where: {
        clerkId: userId
      },
      data: {
        bio: data.bio,
        meetingPreferance: data.meetingPreferance,
        availability: data.availability
      }
    })
  } catch (error) {
    return { error: 'Internal server error.' }
  }
}

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

export async function updateUserSkill(
  userId: string,
  skillData: SkillData
) {
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
