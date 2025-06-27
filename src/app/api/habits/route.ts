import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CreateHabitData } from '@/types'

// GET /api/habits - Get all habits for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const habits = await prisma.habit.findMany({
      where: { userId },
      include: {
        completions: {
          orderBy: { date: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(habits)
  } catch (error) {
    console.error('Error fetching habits:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// POST /api/habits - Create a new habit
export async function POST(request: NextRequest) {
  try {
    const body: CreateHabitData & { userId: string } = await request.json()
    const { title, description, userId } = body

    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Title and User ID are required' },
        { status: 400 }
      )
    }

    const habit = await prisma.habit.create({
      data: {
        title,
        description,
        userId
      },
      include: {
        completions: true
      }
    })

    return NextResponse.json(habit, { status: 201 })
  } catch (error) {
    console.error('Error creating habit:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
