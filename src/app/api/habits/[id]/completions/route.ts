import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay } from 'date-fns'

// POST /api/habits/[id]/completions - Mark habit as complete for a date
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await context.params
    const body = await request.json()
    const { userId, date } = body

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'User ID and date are required' },
        { status: 400 }
      )
    }

    // Ensure we're working with the start of the day
    const completionDate = startOfDay(new Date(date))

    const completion = await prisma.habitCompletion.create({
      data: {
        habitId,
        userId,
        date: completionDate
      },
      include: {
        habit: true
      }
    })

    return NextResponse.json(completion, { status: 201 })
  } catch (error) {
    console.error('Error creating habit completion:', error)
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Habit already completed for this date' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE /api/habits/[id]/completions - Remove habit completion for a date
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await context.params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const date = searchParams.get('date')

    if (!userId || !date) {
      return NextResponse.json(
        { error: 'User ID and date are required' },
        { status: 400 }
      )
    }

    // Ensure we're working with the start of the day
    const completionDate = startOfDay(new Date(date))

    await prisma.habitCompletion.delete({
      where: {
        habitId_userId_date: {
          habitId,
          userId,
          date: completionDate
        }
      }
    })

    return NextResponse.json({ message: 'Habit completion removed successfully' })
  } catch (error) {
    console.error('Error removing habit completion:', error)
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Habit completion not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
