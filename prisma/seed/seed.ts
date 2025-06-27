import { PrismaClient } from '@prisma/client'
import { subDays, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@habitHero.com' },
    update: {},
    create: {
      id: 'demo-user-1',
      name: 'Demo User',
      email: 'demo@habitHero.com',
    },
  })

  console.log('✅ Created demo user:', user.name)

  // Create sample habits
  const habits = [
    {
      title: 'Drink 8 glasses of water',
      description: 'Stay hydrated throughout the day',
    },
    {
      title: 'Read for 30 minutes',
      description: 'Read books, articles, or educational content',
    },
    {
      title: 'Exercise for 30 minutes',
      description: 'Any form of physical activity',
    },
    {
      title: 'Meditate for 10 minutes',
      description: 'Practice mindfulness and meditation',
    },
    {
      title: 'Write in journal',
      description: 'Reflect on the day and write thoughts',
    },
  ]

  const createdHabits = []
  for (const habitData of habits) {
    const habit = await prisma.habit.create({
      data: {
        ...habitData,
        userId: user.id,
      },
    })
    createdHabits.push(habit)
    console.log('✅ Created habit:', habit.title)
  }

  // Create some habit completions for the past week
  const today = new Date()
  for (let i = 0; i < 7; i++) {
    const date = startOfDay(subDays(today, i))
    
    // Randomly complete habits (higher chance for more recent days)
    for (const habit of createdHabits) {
      const completionChance = Math.random()
      const dayAgeBonus = (7 - i) * 0.1 // More likely to complete recent days
      
      if (completionChance + dayAgeBonus > 0.6) {
        await prisma.habitCompletion.create({
          data: {
            habitId: habit.id,
            userId: user.id,
            date: date,
          },
        })
        console.log(`✅ Completed "${habit.title}" on ${date.toDateString()}`)
      }
    }
  }

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
