'use client'

import { useState } from 'react'
import { format, isToday, startOfWeek, addDays, isSameDay } from 'date-fns'
import { Check, Edit2, Trash2, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { HabitWithCompletions } from '@/types'

interface HabitCardProps {
  habit: HabitWithCompletions
  onToggleCompletion: (habitId: string, date: Date, isCompleted: boolean) => Promise<void>
  onEdit: (habit: HabitWithCompletions) => void
  onDelete: (habitId: string) => Promise<void>
}

export function HabitCard({ habit, onToggleCompletion, onEdit, onDelete }: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Get current week dates
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }) // Monday
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Check if habit is completed for a specific date (compare by local date string)
  const isCompletedOnDate = (date: Date) => {
    const target = format(date, 'yyyy-MM-dd')
    return habit.completions.some((completion: { date: string | Date }) => {
      // Support both string and Date
      const compDate = typeof completion.date === 'string'
        ? completion.date.slice(0, 10)
        : format(completion.date, 'yyyy-MM-dd')
      return compDate === target
    })
  }

  // Calculate current streak
  const calculateCurrentStreak = () => {
    let streak = 0
    let currentDate = new Date(today)
    
    while (true) {
      if (isCompletedOnDate(currentDate)) {
        streak++
        currentDate = addDays(currentDate, -1)
      } else {
        break
      }
    }
    
    return streak
  }

  const handleToggleCompletion = async (date: Date) => {
    const isCompleted = isCompletedOnDate(date)
    setIsLoading(true)
    try {
      // Always pass a date object at local midnight
      const localDate = new Date(date)
      localDate.setHours(0, 0, 0, 0)
      await onToggleCompletion(habit.id, localDate, isCompleted)
    } finally {
      setIsLoading(false)
    }
  }

  const currentStreak = calculateCurrentStreak()
  const todayCompleted = isCompletedOnDate(today)

  return (
    <div className="bg-white rounded-lg shadow-md border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{habit.title}</h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(habit)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(habit.id)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Today's completion */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleToggleCompletion(today)}
          disabled={isLoading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors cursor-pointer",
            todayCompleted
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Check className={cn("h-4 w-4", todayCompleted && "text-green-600")} />
          {todayCompleted ? 'Completed Today' : 'Mark as Done'}
        </button>
        
        {currentStreak > 0 && (
          <div className="flex items-center gap-1 text-sm text-orange-600">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{currentStreak} day streak</span>
          </div>
        )}
      </div>

      {/* Weekly view */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">This Week</h4>
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const completed = isCompletedOnDate(date)
            const isCurrentDay = isToday(date)
            
            return (
              <button
                key={index}
                onClick={() => handleToggleCompletion(date)}
                disabled={isLoading}
                className={cn(
                  "aspect-square rounded-md border-2 text-xs font-medium transition-colors relative cursor-pointer",
                  completed
                    ? "bg-green-100 border-green-300 text-green-800"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100",
                  isCurrentDay && "ring-2 ring-blue-400 ring-offset-1",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <span className="absolute inset-x-0 top-1 text-[10px]">
                  {format(date, 'EEE')}
                </span>
                <span className="absolute inset-x-0 bottom-1">
                  {format(date, 'd')}
                </span>
                {completed && (
                  <Check className="h-3 w-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-600" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
