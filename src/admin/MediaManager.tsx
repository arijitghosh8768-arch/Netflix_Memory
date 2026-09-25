import { useEffect, useState } from "react"
import { useParams, Link } from "react-router"
import { coupleService } from "../services/coupleService"
import { mediaService } from "../services/mediaService"
import type { Couple, MediaAsset, MediaType } from "../types/models"

export default function MediaManager() {
  const { id } = useParams<{ id: string }>()
  const [couple, setCouple] = useState<Couple | null>(null)
  const [media, setMedia] = useState<MediaAsset[]>([])
  const [activeTab, setActiveTab] = useState<MediaType>("IMAGE")
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null)

  const loadData = () => {
    if (id) {
      const c = coupleService.getCoupleById(id)
      setCouple(c || null)
      if (c) {
        setMedia(mediaService.getMediaForCouple(id))
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (!couple) return <div className="p-10 text-white">Loading...</div>

  const filteredMedia = media.filter(m => m.type === activeTab)

  const handleAddFakeMedia = () => {
    // Development mockup since real uploads aren't implemented yet
    let storageKey = "/images/hero/hero.webp"
    if (activeTab === "VIDEO") storageKey = "/videos/intro.mp4"
    if (activeTab === "AUDIO") storageKey = "/audio/background.mp3"

    mediaService.createMedia(couple.id, {
      type: activeTab,
      name: `Demo ${activeTab} ${Date.now().toString().slice(-4)}`,
      storageKey,
      mimeType: activeTab === "IMAGE" ? "image/webp" : activeTab === "VIDEO" ? "video/mp4" : "audio/mp3",
      size: Math.floor(Math.random() * 5000000)
    })
    loadData()
  }

  const handleDelete = (mediaId: string) => {
    if (window.confirm("Are you sure you want to delete this media? This cannot be undone.")) {
      mediaService.deleteMedia(mediaId)
      setSelectedMedia(null)
      loadData()
    }
  }

  return (
    <div className="p-10 text-white flex flex-col h-full">
      <div className="mb-4 text-xs font-bold bg-amber-500/20 text-amber-400 p-3 rounded border border-amber-500/50">
        Development Storage: Media management is currently running in development mode. Production private storage and authentication are not enabled.
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to={`/admin/couples/${couple.id}`} className="text-gray-400 text-sm hover:text-white mb-2 inline-block">
            ← Back to {couple.person1Name} & {couple.person2Name}
          </Link>
          <h2 className="text-3xl font-bold uppercase tracking-wider">Media Library</h2>
        </div>
        <button onClick={handleAddFakeMedia} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-bold transition">
          + Add Fake {activeTab}
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-700 mb-6">
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
            <div className="text-center p-12 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
              <p className="text-gray-400">No {activeTab.toLowerCase()}s uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => setSelectedMedia(m)}
                  className={`aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedMedia?.id === m.id ? 'border-red-500 scale-95' : 'border-transparent hover:border-gray-500'}`}
                >
                  {m.type === "IMAGE" ? (
                    <img src={m.storageKey} alt={m.name} className="w-full h-full object-cover" />
                  ) : m.type === "VIDEO" ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-gray-500 font-bold uppercase">Video</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <span className="text-gray-500 font-bold uppercase">Audio</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details Panel */}
        {selectedMedia && (
          <div className="w-80 bg-gray-900 border border-gray-700 rounded-xl p-6 overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-800 pb-2">Media Details</h3>
            
            {selectedMedia.type === "IMAGE" && (
              <img src={selectedMedia.storageKey} alt="Preview" className="w-full h-40 object-cover rounded-md mb-4" />
            )}
            {selectedMedia.type === "VIDEO" && (
              <video src={selectedMedia.storageKey} controls className="w-full h-40 bg-black rounded-md mb-4" />
            )}
            {selectedMedia.type === "AUDIO" && (
              <audio src={selectedMedia.storageKey} controls className="w-full mb-4" />
            )}

            <div className="space-y-3 text-sm text-gray-300 mb-6">
              <div><span className="text-gray-500 block text-xs uppercase">Name</span> {selectedMedia.name}</div>
              <div><span className="text-gray-500 block text-xs uppercase">Type</span> {selectedMedia.mimeType}</div>
              <div><span className="text-gray-500 block text-xs uppercase">Size</span> {(selectedMedia.size / 1024 / 1024).toFixed(2)} MB</div>
              <div><span className="text-gray-500 block text-xs uppercase">Key</span> <span className="truncate block w-full">{selectedMedia.storageKey}</span></div>
            </div>

            <div className="space-y-3 border-t border-gray-800 pt-6">
              <button className="w-full bg-gray-800 hover:bg-gray-700 py-2 rounded text-sm font-semibold transition">
                Assign to Website
              </button>
              <button 
                onClick={() => handleDelete(selectedMedia.id)}
                className="w-full bg-red-900/30 text-red-500 hover:bg-red-900/50 py-2 rounded text-sm font-semibold transition"
              >
                Delete Media
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
