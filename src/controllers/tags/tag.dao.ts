import prisma from '../../utils/prisma'

export const getTags = async () => {
  return await prisma.tag.findMany({})
}
