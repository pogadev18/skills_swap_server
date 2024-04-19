import prisma from '../../utils/prisma'

import type { UserCard } from '@prisma/client'

export async function createCard(userId: string) {
  await prisma.userCard.create({
    data: {
      userId: userId
    }
  })

  console.log('Card created for user:', userId)
}

export async function updateCardInfo(
  userId: string | undefined,
  data: Pick<UserCard, 'isActive' | 'shareableLink'>
) {
  return await prisma.userCard.update({
    where: {
      userId
    },
    data: {
      isActive: data.isActive,
      shareableLink: data.shareableLink
    }
  })
}
