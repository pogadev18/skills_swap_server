import prisma from '../../../utils/prisma'

export const createUser = async (userId: string) => {
  try {
    await prisma.user.create({
      data: {
        clerkId: userId
      }
    })
    console.log('User created:', userId)
  } catch (error) {
    console.error('Error handling user created:', error)
  }
}

export const deleteUser = async (userId: string) => {
  try {
    await prisma.user.delete({
      where: {
        clerkId: userId
      }
    })

    console.log('User deleted:', userId)
  } catch (error) {
    console.error('Failed to delete user from DB:', error)
  }
}
