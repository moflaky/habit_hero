"use client"

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Trash2, ChevronLeft, Loader2 } from 'lucide-react'
import type { HabitWithCompletions } from '@/types'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userStats, setUserStats] = useState<{ totalCompletions: number, totalHabits: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    fetchStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, status])

  const fetchStats = async () => {
    if (!session?.user?.id) return
    setLoading(true)
    try {
      const res = await fetch(`/api/users/${session.user.id}`)
      if (res.ok) {
        const user = await res.json()
        const completions = user.habits.flatMap((h: HabitWithCompletions) => h.completions)
        const totalCompletions = completions.length
        const totalHabits = user.habits.length
        setUserStats({ totalCompletions, totalHabits })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true)
      return
    }
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/users/${session?.user?.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        signOut({ callbackUrl: '/auth/signin' })
      } else {
        setError('Failed to delete account')
      }
    } catch {
      setError('Failed to delete account')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <button
            onClick={() => router.push("/")}
            className="mr-2 px-2 py-1 rounded hover:bg-blue-50 text-blue-600 border border-blue-100 transition-colors cursor-pointer"
            aria-label="Back to main app"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Account</h2>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Mail className="h-4 w-4" />
            <span>{session?.user?.email}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <span className="font-medium">Name:</span>
            <span>{session?.user?.name}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-gray-700">Total Habits: <span className="font-semibold">{userStats?.totalHabits ?? 0}</span></div>
          <div className="text-gray-700">Total Completions: <span className="font-semibold">{userStats?.totalCompletions ?? 0}</span></div>
        </div>
        <div>
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors bg-red-100 text-red-700 hover:bg-red-200 mt-4 w-full cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            {deleteConfirm ? 'Confirm Delete Account' : 'Delete Account'}
          </button>
          {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
        </div>
      </div>
    </div>
  )
}
