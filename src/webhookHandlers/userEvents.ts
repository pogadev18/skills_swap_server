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
