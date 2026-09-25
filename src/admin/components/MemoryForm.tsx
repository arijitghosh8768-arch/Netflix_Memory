import { useState } from 'react'
import type { Memory, MediaAsset } from '../../types/models'
import MediaPicker from './MediaPicker'

interface MemoryFormProps {
  initialData?: Memory
  mediaAssets: MediaAsset[]
  onSave: (data: Partial<Memory>) => Promise<void>
  onCancel: () => void
}

export default function MemoryForm({ initialData, mediaAssets, onSave, onCancel }: MemoryFormProps) {
  const [formData, setFormData] = useState<Partial<Memory>>(initialData || { title: '', category: 'General', description: '', featured: false })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) {
      setError("Title is required")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save memory")
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
          <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
          <input 
            type="text" 
            value={formData.category || ''} 
            onChange={e => setFormData({...formData, category: e.target.value})} 
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

      <div className="grid grid-cols-2 gap-4">
        <MediaPicker 
          label="Cover Image" 
          typeFilter="IMAGE" 
          mediaAssets={mediaAssets} 
          selectedId={formData.coverMediaId} 
          onSelect={(id) => setFormData({...formData, coverMediaId: id})} 
        />
        <MediaPicker 
          label="Video (Optional)" 
          typeFilter="VIDEO" 
          mediaAssets={mediaAssets} 
          selectedId={formData.videoMediaId} 
          onSelect={(id) => setFormData({...formData, videoMediaId: id})} 
        />
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input 
          type="checkbox" 
          id="featured" 
          checked={formData.featured || false} 
          onChange={e => setFormData({...formData, featured: e.target.checked})} 
          className="w-4 h-4"
        />
        <label htmlFor="featured" className="text-sm text-gray-300">Feature this memory on the home page</label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
        <button type="button" onClick={onCancel} disabled={isSaving} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
        <button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
          {isSaving ? "Saving..." : "Save Memory"}
        </button>
      </div>
    </form>
  )
}
