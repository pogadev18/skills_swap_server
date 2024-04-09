import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

let skillsAndTags = [
  { skill: 'Programming', tags: ['JavaScript', 'Python', 'Java'] },
  { skill: 'Guitar Playing', tags: ['Acoustic', 'Electric', 'Classical'] },
  { skill: 'Cooking', tags: ['Italian', 'Chinese', 'Indian'] },
  { skill: 'Baking', tags: ['Bread', 'Cakes', 'Pastries'] },
  { skill: 'Drawing', tags: ['Pencil', 'Charcoal', 'Digital'] },
  { skill: 'Photography', tags: ['Portrait', 'Landscape', 'Wildlife'] },
  { skill: 'Yoga', tags: ['Hatha', 'Vinyasa', 'Kundalini'] },
  { skill: 'Gardening', tags: ['Vegetables', 'Flowers', 'Herbs'] },
  { skill: 'Sewing', tags: ['Clothing', 'Quilting', 'Embroidery'] },
  { skill: 'Woodworking', tags: ['Carpentry', 'Carving', 'Furniture'] },
  { skill: 'Language Learning', tags: ['Spanish', 'French', 'Mandarin'] },
  { skill: 'Dance', tags: ['Ballet', 'Hip Hop', 'Salsa'] },
  { skill: 'Martial Arts', tags: ['Karate', 'Judo', 'Taekwondo'] },
  { skill: 'Swimming', tags: ['Freestyle', 'Backstroke', 'Butterfly'] },
  { skill: 'Cycling', tags: ['Road', 'Mountain', 'BMX'] },
  { skill: 'Chess', tags: ['Openings', 'Middle Game', 'End Game'] },
  {
    skill: 'Video Editing',
    tags: ['Adobe Premiere', 'Final Cut', 'DaVinci Resolve']
  },
  { skill: 'Makeup', tags: ['Everyday', 'Bridal', 'Special Effects'] },
  { skill: 'Web Development', tags: ['HTML', 'CSS', 'React'] },
  { skill: 'Graphic Design', tags: ['Logo Design', 'UI/UX', 'Print'] },
  { skill: 'Piano Playing', tags: ['Classical', 'Jazz', 'Pop'] },
  { skill: 'Singing', tags: ['Classical', 'Pop', 'Opera'] },
  { skill: 'Acting', tags: ['Theater', 'Film', 'Voice Acting'] },
  {
    skill: 'Digital Marketing',
    tags: ['SEO', 'Content Marketing', 'Social Media']
  },
  { skill: 'Writing', tags: ['Fiction', 'Non-fiction', 'Poetry'] },
  { skill: 'Magic', tags: ['Card Tricks', 'Coin Tricks', 'Stage Magic'] },
  { skill: 'Brewing', tags: ['Beer', 'Wine', 'Cider'] },
  { skill: 'Fishing', tags: ['Freshwater', 'Saltwater', 'Fly Fishing'] },
  { skill: 'Knitting', tags: ['Scarves', 'Sweaters', 'Hats'] },
  { skill: 'Running', tags: ['Sprints', 'Middle Distance', 'Marathon'] },
  {
    skill: 'Climbing',
    tags: ['Bouldering', 'Sport Climbing', 'Traditional Climbing']
  },
  { skill: 'Archery', tags: ['Target', 'Field', 'Bowhunting'] },
  { skill: 'Hiking', tags: ['Day Hikes', 'Backpacking', 'Mountain'] },
  {
    skill: 'Astronomy',
    tags: ['Stargazing', 'Telescope Use', 'Astrophotography']
  },
  { skill: 'Robotics', tags: ['Design', 'Programming', 'Competitions'] },
  { skill: 'Electronics', tags: ['Circuit Design', 'Arduino', 'Raspberry Pi'] },
  {
    skill: 'Game Development',
    tags: ['Unity', 'Unreal Engine', 'Game Design']
  },
  { skill: 'Calligraphy', tags: ['Western', 'Eastern', 'Modern'] },
  { skill: 'Meditation', tags: ['Mindfulness', 'Transcendental', 'Zen'] },
  { skill: 'Skateboarding', tags: ['Street', 'Park', 'Vert'] },
  { skill: 'Surfing', tags: ['Shortboard', 'Longboard', 'Paddleboarding'] },
  { skill: 'Snowboarding', tags: ['Freestyle', 'Freeride', 'Alpine'] },
  { skill: 'Skiing', tags: ['Downhill', 'Cross Country', 'Freestyle'] },
  { skill: 'Fashion Design', tags: ['Sketching', 'Pattern Making', 'Sewing'] },
  { skill: 'Interior Design', tags: ['Residential', 'Commercial', 'Styling'] },
  { skill: 'Film Making', tags: ['Directing', 'Cinematography', 'Editing'] },
  { skill: 'Sculpting', tags: ['Clay', 'Stone', 'Metal'] },
  { skill: 'Pottery', tags: ['Wheel Throwing', 'Hand Building', 'Glazing'] },
  {
    skill: 'Jewelry Making',
    tags: ['Beading', 'Wire Wrapping', 'Metalworking']
  },
  { skill: 'Animal Care', tags: ['Dogs', 'Cats', 'Exotic Pets'] }
]

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
