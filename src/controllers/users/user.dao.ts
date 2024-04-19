import prisma from '../../utils/prisma'
import { updateSkillTags } from '../skills/skill.dao'

import type { UserBioData } from './put-user-biography.controller'
import type { SkillData } from './put-user-skills.controller'

export async function getUser(userId: string | undefined) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId
    },
    select: {
      id: true,
      clerkId: true,
      bio: true,
      meetingPreferance: true,
      availability: true,
      skills: {
        select: {
          isOffered: true,
          weight: true,
          isActive: true,
          skill: {
            select: {
              id: true,
              name: true,
              tags: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        }
      },
      UserCard: {
        select: {
          isActive: true,
          shareableLink: true,
          createdAt: true,
          updatedAt: true
        }
      }
    }
  })

  return user || { error: 'User not found.' }
}

export async function updateUserBiograpghy(
  userId: string | undefined,
  data: UserBioData
) {
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
}

export async function updateUserSkill(userId: string, skillData: SkillData) {
  const userSkillPromise = prisma.userSkill.upsert({
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

  const updateSkillTagsPromise = updateSkillTags(
    skillData.skillId,
    skillData.tagIds
  )

  // todo: dounble check if this is the correct way to handle the transaction
  return Promise.all([userSkillPromise, updateSkillTagsPromise])
}

export async function getAllUserSkills(userId: string) {
  return await prisma.userSkill.findMany({
    where: {
      userId
    }
  })
}

export async function createUser(userId: string) {
  await prisma.user.create({
    data: {
      clerkId: userId
    }
  })
  console.log('User created:', userId)
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({
    where: {
      clerkId: userId
    }
  })

  console.log('User deleted:', userId)
}
