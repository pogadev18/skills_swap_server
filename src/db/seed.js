import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function addSkillWithTags(skillName, tags) {
  const skill = await prisma.skill.create({
    data: {
      name: skillName,
      tags: {
        create: tags.map((tagName) => ({
          name: tagName
        }))
      }
    }
  })
  console.log(`Added skill: ${skill.name} with tags: ${tags.join(', ')}`)
}

async function run() {
  await addSkillWithTags('Fighting', ['Box', 'KickBox', 'MMA'])

  await prisma.$disconnect()
}

run().catch(async (e) => {
  console.error(e)
  await prisma.$disconnect()
  process.exit(1)
})
