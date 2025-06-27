import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UpdateHabitData } from '@/types'

// GET /api/habits/[id] - Get a specific habit
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    const habit = await prisma.habit.findUnique({
      where: { id },
      include: {
        completions: {
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!habit) {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error fetching habit:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// PATCH /api/habits/[id] - Update a habit
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body: UpdateHabitData = await request.json()

    const habit = await prisma.habit.update({
      where: { id },
      data: body,
      include: {
        completions: true
      }
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error('Error updating habit:', error)
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE /api/habits/[id] - Delete a habit
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.habit.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Habit deleted successfully' })
  } catch (error) {
    console.error('Error deleting habit:', error)
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Habit not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
