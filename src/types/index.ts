import type { User, Habit, HabitCompletion } from '@prisma/client'

export type HabitWithCompletions = Habit & {
  completions: HabitCompletion[]
}

export type UserWithHabits = User & {
  habits: HabitWithCompletions[]
}

export type CreateHabitData = {
  title: string
  description?: string
}

export type UpdateHabitData = {
  title?: string
  description?: string
}

export type HabitCompletionWithHabit = HabitCompletion & {
  habit: Habit
}

export type StreakData = {
  current: number
  longest: number
  weeklyCount: number
  monthlyCount: number
}
