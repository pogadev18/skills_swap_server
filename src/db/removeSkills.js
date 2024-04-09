import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function deleteAllSkillsAndTags() {
  // First, disconnect all tags from skills to avoid foreign key constraint violations
  console.log('Disconnecting all tags from skills...')
  const allSkills = await prisma.skill.findMany({
    include: { tags: true }
  })

  for (const skill of allSkills) {
    if (skill.tags.length > 0) {
      await prisma.skill.update({
        where: { id: skill.id },
        data: { tags: { set: [] } } // Disconnects all tags from this skill
      })
    }
  }

  // Once all tags are disconnected, delete all tags
  console.log('Deleting all tags...')
  await prisma.tag.deleteMany({})

  // Finally, delete all skills
  console.log('Deleting all skills...')
  await prisma.skill.deleteMany({})

  console.log('All skills and tags have been deleted.')
}

async function run() {
  await deleteAllSkillsAndTags()
  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error(`Error: ${e.message}`)
  await prisma.$disconnect()
  process.exit(1)
})
