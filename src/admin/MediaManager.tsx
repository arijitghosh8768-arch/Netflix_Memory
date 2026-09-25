import { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router"
import { coupleService } from "../services/coupleService"
import { mediaService } from "../services/mediaService"
import { storageService } from "../services/storageService"
import { isSupabaseConfigured } from "../lib/supabase"
import type { Couple, MediaAsset, MediaType } from "../types/models"

export default function MediaManager() {
  const { id } = useParams<{ id: string }>()
  const [couple, setCouple] = useState<Couple | null>(null)
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [activeTab, setActiveTab] = useState<MediaType>("IMAGE")
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)
  
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = async () => {
    if (id) {
      const c = await coupleService.getCoupleById(id)
      setCouple(c || null)
      if (c) {
        const m = await mediaService.getMediaForCouple(id)
        setMedia(m)
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  // Resolve signed URLs for assets
  useEffect(() => {
    const resolveUrls = async () => {
      const newUrls: Record<string, string> = { ...previewUrls }
      for (const m of media) {
        if (!newUrls[m.id] && id) {
          try {
            newUrls[m.id] = await storageService.createSignedUrl(m.storageKey, id)
          } catch (e) {
            console.error(e)
          }
        }
      }
      setPreviewUrls(newUrls)
    }
    resolveUrls()
  }, [media, id])

  if (!couple) return <div className="p-10 text-white">Loading...</div>

  const filteredMedia = media.filter(m => m.type === activeTab)

  const getAcceptString = () => {
    if (activeTab === 'IMAGE') return 'image/jpeg,image/png,image/webp,image/avif'
    if (activeTab === 'VIDEO') return 'video/mp4,video/webm'
    return 'audio/mpeg,audio/wav,audio/aac'
  }

  const validateFile = (file: File) => {
    // Basic Limits
    const limits = {
      IMAGE: 10 * 1024 * 1024, // 10MB
      VIDEO: 100 * 1024 * 1024, // 100MB
      AUDIO: 20 * 1024 * 1024 // 20MB
    }
    if (file.size > limits[activeTab]) {
      throw new Error(`File is too large. Limit is ${limits[activeTab] / (1024*1024)}MB for ${activeTab.toLowerCase()}`)
    }
    if (!file.type.startsWith(activeTab.toLowerCase())) {
      throw new Error(`Invalid file type. Please upload a valid ${activeTab.toLowerCase()} file.`)
    }
  }

  const handleUploadClick = () => {
    setUploadError("")
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadError("")
      validateFile(file)
      setIsUploading(true)
      
      const storageKey = await storageService.uploadMedia(couple.id, activeTab.toLowerCase(), file)
      
      await mediaService.createMedia(couple.id, {
        type: activeTab,
        name: file.name,
        storageKey,
        mimeType: file.type,
        size: file.size
      })
      
      await loadData()
    } catch (err: any) {
      setUploadError(err.message || "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (mediaAsset: MediaAsset) => {
    if (window.confirm("Are you sure you want to delete this media? This cannot be undone.")) {
      try {
        await storageService.deleteMedia(mediaAsset.storageKey)
        mediaService.deleteMedia(mediaAsset.id)
        setSelectedMedia(null)
        loadData()
      } catch (err: any) {
        alert(`Failed to delete: ${err.message}`)
      }
    }
  }

  return (
    <div className="p-10 text-white flex flex-col h-full bg-gray-950">
      {!isSupabaseConfigured && (
        <div className="mb-4 text-xs font-bold bg-amber-500/20 text-amber-400 p-3 rounded border border-amber-500/50">
          Development Storage: Production private storage is not configured. Using local mock storage.
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to={`/admin/couples/${couple.id}`} className="text-gray-400 text-sm hover:text-white mb-2 inline-block">
            ← Back to {couple.person1Name} & {couple.person2Name}
          </Link>
          <h2 className="text-3xl font-bold uppercase tracking-wider">Media Library</h2>
        </div>
        <div className="flex items-center gap-4">
          {isUploading && <span className="text-sm text-gray-400 animate-pulse">Uploading...</span>}
          {uploadError && <span className="text-sm text-red-500">{uploadError}</span>}
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelected} 
            accept={getAcceptString()} 
            className="hidden" 
          />
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-6 py-2 rounded font-bold transition shadow-lg shadow-red-900/20"
          >
            + Upload {activeTab}
          </button>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-800 mb-6">
        {(["IMAGE", "VIDEO", "AUDIO"] as MediaType[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setSelectedMedia(null); }}
            className={`px-4 py-2 font-semibold transition-colors ${activeTab === tab ? "text-white border-b-2 border-red-500" : "text-gray-500 hover:text-gray-300"}`}
          >
            {tab === "IMAGE" ? "Photos" : tab === "VIDEO" ? "Videos" : "Audio"}
          </button>
        ))}
      </div>

      <div className="flex-1 flex gap-8 min-h-0">
        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredMedia.length === 0 ? (
            <div className="text-center p-12 bg-gray-900 border border-dashed border-gray-800 rounded-xl">
              <p className="text-gray-500">No {activeTab.toLowerCase()}s uploaded yet.</p>
              <button onClick={handleUploadClick} className="mt-4 text-red-500 hover:text-red-400 font-semibold text-sm">
                Upload your first {activeTab.toLowerCase()}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map(m => {
                const url = previewUrls[m.id]
                return (
                  <div 
                    key={m.id} 
                    onClick={() => setSelectedMedia(m)}
                    className={`aspect-square bg-gray-900 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedMedia?.id === m.id ? 'border-red-500 scale-95 shadow-lg shadow-red-900/20' : 'border-gray-800 hover:border-gray-600'}`}
                  >
                    {m.type === "IMAGE" && url ? (
                      <img src={url} alt={m.name} className="w-full h-full object-cover" />
                    ) : m.type === "VIDEO" ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                        <span className="text-2xl mb-2">▶</span>
                        <span className="text-xs font-bold uppercase tracking-wider truncate w-3/4 text-center">{m.name}</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                        <span className="text-2xl mb-2">♪</span>
                        <span className="text-xs font-bold uppercase tracking-wider truncate w-3/4 text-center">{m.name}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedMedia && (
          <div className="w-80 bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Media Details</h3>
            
            {selectedMedia.type === "IMAGE" && previewUrls[selectedMedia.id] && (
              <img src={previewUrls[selectedMedia.id]} alt="Preview" className="w-full h-40 object-cover rounded-md mb-4 bg-black" />
            )}
            {selectedMedia.type === "VIDEO" && previewUrls[selectedMedia.id] && (
              <video src={previewUrls[selectedMedia.id]} controls className="w-full h-40 bg-black rounded-md mb-4" />
            )}
            {selectedMedia.type === "AUDIO" && previewUrls[selectedMedia.id] && (
              <audio src={previewUrls[selectedMedia.id]} controls className="w-full mb-4" />
            )}

            <div className="space-y-3 text-sm text-gray-400 mb-6 bg-gray-950 p-4 rounded-lg border border-gray-800">
              <div><span className="text-gray-600 block text-[10px] font-bold uppercase tracking-widest mb-1">Name</span> <span className="truncate block">{selectedMedia.name}</span></div>
              <div><span className="text-gray-600 block text-[10px] font-bold uppercase tracking-widest mb-1">Type</span> {selectedMedia.mimeType}</div>
              <div><span className="text-gray-600 block text-[10px] font-bold uppercase tracking-widest mb-1">Size</span> {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB</div>
              <div><span className="text-gray-600 block text-[10px] font-bold uppercase tracking-widest mb-1">Storage Key</span> <span className="truncate block w-full text-xs font-mono bg-black p-1 rounded mt-1 border border-gray-800">{selectedMedia.storageKey}</span></div>
            </div>

            <div className="space-y-3 border-t border-gray-800 pt-6">
              <button 
                onClick={() => handleDelete(selectedMedia)}
                className="w-full bg-red-900/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 py-3 rounded text-sm font-bold transition border border-red-900/50"
              >
                Delete Asset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
