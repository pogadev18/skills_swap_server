import prisma from '../../utils/prisma'

export async function getSkills() {
  return await prisma.skill.findMany({
    include: {
      tags: true
    }
  })
}

/*
TODOS:
- use zod to validate the payload of the updateUserSkills request
- scenarios to test:
  1. update existing skills with different isOffered, weight, or tagIds
  2. remove all tags from a skill to ensure the clear and connect logic works as expected
  3. handling and gracefully responding to invalid skillId or tagIds

*/

export function updateSkillTags(skillId: string, tagIds: string[]) {
  const clearTags = prisma.skill.update({
    where: { id: skillId },
    data: { tags: { set: [] } }
  })

  const connectTagsPromises = tagIds.map((tagId) =>
    prisma.tag.update({
      where: { id: tagId },
      data: { skills: { connect: { id: skillId } } }
    })
  )

  return prisma.$transaction([clearTags, ...connectTagsPromises])
}
