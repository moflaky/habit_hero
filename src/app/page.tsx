'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Target, TrendingUp, LogOut, User } from 'lucide-react'
import { HabitCard } from '@/components/HabitCard'
import { EditHabitForm } from '@/components/EditHabitForm'
import { CreateHabitForm } from '@/components/CreateHabitForm'
import type { HabitWithCompletions } from '@/types'
import { format } from 'date-fns'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [habits, setHabits] = useState<HabitWithCompletions[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<HabitWithCompletions | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/auth/signin')
      return
    }
  }, [session, status, router])

  // Fetch habits on component mount
  useEffect(() => {
    if (session?.user?.id) {
      fetchHabits()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  const fetchHabits = async () => {
    if (!session?.user?.id) return
    
    try {
      const response = await fetch(`/api/habits?userId=${session.user.id}`)
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
    if (!session?.user?.id) return

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          userId: session.user.id,
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
    if (!session?.user?.id) return

    try {
      if (isCompleted) {
        // Remove completion
        const response = await fetch(
          `/api/habits/${habitId}/completions?userId=${session.user.id}&date=${date.toISOString()}`,
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
            userId: session.user.id,
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
    setEditingHabit(habit)
  }

  const handleUpdateHabit = async (habitId: string, data: { title: string; description?: string }) => {
    if (!session?.user?.id) return
    try {
      const response = await fetch(`/api/habits/${habitId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await fetchHabits()
        setEditingHabit(null)
      }
    } catch (error) {
      console.error('Error updating habit:', error)
    }
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

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  const todayCompletions = habits.reduce((count, habit) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd')
    const completedToday = habit.completions.some((completion: { date: string | Date }) => {
      const compDateStr = typeof completion.date === 'string'
        ? completion.date.slice(0, 10)
        : format(completion.date, 'yyyy-MM-dd')
      return compDateStr === todayStr
    })
    return completedToday ? count + 1 : count
  }, 0)

  // Show loading while checking authentication
  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

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
        {/* Header with User Info */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-900">Habit Hero</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <Link href="/account" className="text-sm hover:underline hover:text-blue-700 transition-colors" title="Account settings">
                  {session.user?.name}
                </Link>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-md transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
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
              className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
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
              editingHabit && editingHabit.id === habit.id ? (
                <EditHabitForm
                  key={habit.id}
                  habit={editingHabit}
                  onSubmit={(data: { title: string; description?: string }) => handleUpdateHabit(habit.id, data)}
                  onCancel={() => setEditingHabit(null)}
                />
              ) : (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleCompletion={handleToggleCompletion}
                  onEdit={handleEditHabit}
                  onDelete={handleDeleteHabit}
                />
              )
            ))
          )}
        </div>
      </div>
    </div>
  )
}
