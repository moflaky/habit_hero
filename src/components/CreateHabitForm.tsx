'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateHabitFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>
  onCancel: () => void
}

export function CreateHabitForm({ onSubmit, onCancel }: CreateHabitFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined
      })
      setTitle('')
      setDescription('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Create New Habit</h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Habit Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Drink 8 glasses of water"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Additional details about your habit..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
            "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500",
            "disabled:bg-gray-300 disabled:cursor-not-allowed"
          )}
        >
          <Plus className="h-4 w-4" />
          {isSubmitting ? 'Creating...' : 'Create Habit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
