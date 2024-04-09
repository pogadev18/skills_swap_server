import prisma from '../../utils/prisma'

export const getSkills = async () => {
  try {
    return await prisma.skill.findMany({
      include: {
        tags: true
      }
    })
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}
