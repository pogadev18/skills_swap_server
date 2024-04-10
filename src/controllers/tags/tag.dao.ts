import prisma from '../../utils/prisma'

export const getTags = async () => {
  try {
    return await prisma.tag.findMany({})
  } catch (error) {
    console.error('Error fetching tags:', error)
  }
}
