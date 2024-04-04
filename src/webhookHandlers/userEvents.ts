import type { UserWebhookEvent } from '@clerk/clerk-sdk-node'

import prisma from '../utils/prisma'

const handleUserCreated = async (eventData: UserWebhookEvent) => {
  try {
    const { data } = eventData

    if (!data) {
      console.error('No data in event')
      return
    }

    const clerkUserId = data.id as string

    await prisma.user.create({
      data: {
        clerkId: clerkUserId
      }
    })
    console.log('User created:', clerkUserId)
  } catch (error) {
    console.error('Error handling user created:', error)
  }
}


// 2 improvements:
// - cascade all - delete entire user record and all related records
// - is it safe to have the /:userId in the URL?

const handleUserDeleted = async (eventData: UserWebhookEvent) => {
  try {
    const { data } = eventData

    if (!data) {
      console.error('No data in event')
      return
    }

    const clerkUserId = data.id as string

    await prisma.user.delete({
      where: {
        clerkId: clerkUserId
      }
    })

    console.log('User deleted:', clerkUserId)
  } catch (error) {
    console.error('Failed to delete user from DB:', error)
  }
}

export { handleUserCreated, handleUserDeleted }
