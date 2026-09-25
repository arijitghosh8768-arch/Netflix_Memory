import { useState } from 'react'
import type { Profile, MediaAsset } from '../../types/models'
import MediaPicker from './MediaPicker'

interface ProfileFormProps {
  initialData?: Profile
  mediaAssets: MediaAsset[]
  onSave: (data: Partial<Profile>) => Promise<void>
  onCancel: () => void
}

export default function ProfileForm({ initialData, mediaAssets, onSave, onCancel }: ProfileFormProps) {
  const [formData, setFormData] = useState<Partial<Profile>>(initialData || { name: '', theme: '', mediaId: '' })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      setError("Name is required")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      await onSave(formData)
    } catch (err: any) {
      setError(err.message || "Failed to save profile")
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-4">
      {error && <div className="text-red-400 text-sm bg-red-900/30 p-2 rounded">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Name *</label>
        <input 
          type="text" 
          value={formData.name || ''} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
          className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-red-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-1">Theme (Optional)</label>
        <input 
          type="text" 
          value={formData.theme || ''} 
          onChange={e => setFormData({...formData, theme: e.target.value})} 
          className="w-full bg-gray-950 border border-gray-700 rounded p-2 text-white focus:border-red-500"
        />
      </div>

      <MediaPicker 
        label="Profile Image" 
        typeFilter="IMAGE" 
        mediaAssets={mediaAssets} 
        selectedId={formData.mediaId} 
        onSelect={(id) => setFormData({...formData, mediaId: id})} 
      />

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} disabled={isSaving} className="text-gray-400 hover:text-white px-4 py-2">Cancel</button>
        <button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-bold disabled:opacity-50">
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  )
}
