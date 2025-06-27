'use client'

import { useState, useEffect } from 'react'
import { Plus, Target, TrendingUp } from 'lucide-react'
import { HabitCard } from '@/components/HabitCard'
import { CreateHabitForm } from '@/components/CreateHabitForm'
import type { HabitWithCompletions } from '@/types'

// Mock user ID for demo purposes
const DEMO_USER_ID = 'demo-user-1'

export default function Home() {
  const [habits, setHabits] = useState<HabitWithCompletions[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch habits on component mount
  useEffect(() => {
    fetchHabits()
  }, [])

  const fetchHabits = async () => {
    try {
      const response = await fetch(`/api/habits?userId=${DEMO_USER_ID}`)
      if (response.ok) {
        const data = await response.json()
        setHabits(data)
      }
    } catch (error) {
      console.error('Error fetching habits:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateHabit = async (data: { title: string; description?: string }) => {
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: DEMO_USER_ID,
        }),
      })

      if (response.ok) {
        const newHabit = await response.json()
        setHabits([newHabit, ...habits])
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Error creating habit:', error)
    }
  }

  const handleToggleCompletion = async (habitId: string, date: Date, isCompleted: boolean) => {
    try {
      if (isCompleted) {
        // Remove completion
        const response = await fetch(
          `/api/habits/${habitId}/completions?userId=${DEMO_USER_ID}&date=${date.toISOString()}`,
          { method: 'DELETE' }
        )
        if (response.ok) {
          await fetchHabits() // Refresh data
        }
      } else {
        // Add completion
        const response = await fetch(`/api/habits/${habitId}/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: DEMO_USER_ID,
            date: date.toISOString(),
          }),
        })
        if (response.ok) {
          await fetchHabits() // Refresh data
        }
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error)
    }
  }

  const handleEditHabit = (habit: HabitWithCompletions) => {
    // TODO: Implement edit functionality
    console.log('Edit habit:', habit)
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return

    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setHabits(habits.filter(h => h.id !== habitId))
      }
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  const todayCompletions = habits.reduce((count, habit) => {
    const today = new Date()
    const completedToday = habit.completions.some((completion: { date: string | Date }) =>
      new Date(completion.date).toDateString() === today.toDateString()
    )
    return completedToday ? count + 1 : count
  }, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your habits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Habit Hero</h1>
          </div>
          <p className="text-gray-600 text-lg">
            Build better habits, one day at a time
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{habits.length}</div>
            <div className="text-gray-600">Total Habits</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{todayCompletions}</div>
            <div className="text-gray-600">Completed Today</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-3xl font-bold">
                {habits.length > 0 ? Math.round((todayCompletions / habits.length) * 100) : 0}%
              </span>
            </div>
            <div className="text-gray-600">Success Rate</div>
          </div>
        </div>

        {/* Create Habit Button */}
        {!showCreateForm && (
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              Create New Habit
            </button>
          </div>
        )}

        {/* Create Habit Form */}
        {showCreateForm && (
          <div className="mb-6">
            <CreateHabitForm
              onSubmit={handleCreateHabit}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        )}

        {/* Habits List */}
        <div className="space-y-6">
          {habits.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No habits yet
              </h3>
              <p className="text-gray-500">
                Create your first habit to start building better routines!
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleCompletion={handleToggleCompletion}
                onEdit={handleEditHabit}
                onDelete={handleDeleteHabit}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
