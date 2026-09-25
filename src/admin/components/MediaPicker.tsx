import { useState } from 'react'
import type { MediaAsset } from '../../types/models'

interface MediaPickerProps {
  mediaAssets: MediaAsset[]
  selectedId?: string
  onSelect: (id: string) => void
  typeFilter?: 'IMAGE' | 'VIDEO' | 'AUDIO'
  label?: string
}

export default function MediaPicker({ mediaAssets, selectedId, onSelect, typeFilter, label = "Select Media" }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const filtered = typeFilter ? mediaAssets.filter(m => m.type === typeFilter) : mediaAssets
  const selectedAsset = mediaAssets.find(m => m.id === selectedId)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <div className="flex items-center gap-3">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gray-800 border border-gray-700 hover:border-gray-500 text-sm px-4 py-2 rounded text-left flex-1 transition"
        >
          {selectedAsset ? `${selectedAsset.name} (${selectedAsset.type})` : 'Choose media...'}
        </button>
        {selectedId && (
          <button type="button" onClick={() => onSelect('')} className="text-gray-500 hover:text-red-400 text-sm">Clear</button>
        )}
      </div>

      {isOpen && (
        <div className="p-4 bg-gray-900 border border-gray-700 rounded mt-2 max-h-60 overflow-y-auto grid grid-cols-2 gap-2">
          {filtered.length === 0 && <p className="text-xs text-gray-500 col-span-2">No matching media found.</p>}
          {filtered.map(m => (
            <div 
              key={m.id} 
              onClick={() => { onSelect(m.id); setIsOpen(false); }}
              className={`p-2 border rounded cursor-pointer text-xs truncate transition ${selectedId === m.id ? 'border-red-500 bg-red-900/20 text-white' : 'border-gray-700 hover:border-gray-500 text-gray-400'}`}
              title={m.name}
            >
              {m.type === 'IMAGE' ? '🖼️ ' : m.type === 'VIDEO' ? '🎥 ' : '🎵 '}{m.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
