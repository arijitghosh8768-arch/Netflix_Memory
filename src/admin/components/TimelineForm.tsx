import { useState } from 'react'
import type { TimelineEvent, MediaAsset } from '../../types/models'
import MediaPicker from './MediaPicker'

interface TimelineFormProps {
  initialData?: TimelineEvent
  mediaAssets: MediaAsset[]
  onSave: (data: Partial<TimelineEvent>) => Promise<void>
  onCancel: () => void
}

export default function TimelineForm({ initialData, mediaAssets, onSave, onCancel }: TimelineFormProps) {
  const [formData, setFormData] = useState<Partial<TimelineEvent>>(initialData || { title: '', date: new Date().toISOString().split('T')[0], description: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.date) {
      setError("Title and Date are required")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save timeline event")
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
      {error && <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded">{error}</div>}
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Title *</label>
          <input 
            type="text" 
            value={formData.title || ''} 
            onChange={e => setFormData({...formData, title: e.target.value})} 
            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Date *</label>
          <input 
            type="date" 
            value={formData.date || ''} 
            onChange={e => setFormData({...formData, date: e.target.value})} 
            className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
        <textarea 
          value={formData.description || ''} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
          className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-red-500 h-24"
        />
      </div>

      <MediaPicker 
        label="Event Media (Optional)" 
        mediaAssets={mediaAssets} 
        selectedId={formData.mediaId} 
        onSelect={(id) => setFormData({...formData, mediaId: id})} 
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <button type="button" onClick={onCancel} disabled={isSaving} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
        <button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
          {isSaving ? "Saving..." : "Save Event"}
        </button>
      </div>
    </form>
  )
}
