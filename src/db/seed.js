import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

let skillsAndTags = []

async function addSkillWithTags() {
  for (const { skill, tags } of skillsAndTags) {
    try {
      console.log(
        `Attempting to add skill: ${skill} with tags: ${tags.join(', ')}`
      )
      await prisma.skill.create({
        data: {
          name: skill,
          tags: {
            create: tags.map((tagName) => ({
              name: tagName
            }))
          }
        }
      })
      console.log(`Successfully added skill: ${skill}`)
    } catch (e) {
      console.error(`Error adding skill: ${skill}. Error: ${e.message}`)
      // If the error is due to a unique constraint on tags, it may not be immediately clear
      // Consider adding more specific logging or checks here if tags often have duplicate names
    }
  }
}

async function run() {
  await addSkillWithTags()

  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
