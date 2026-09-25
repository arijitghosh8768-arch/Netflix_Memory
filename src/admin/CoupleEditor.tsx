import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { coupleService, contentService } from "../services/coupleService"
import { mediaService } from "../services/mediaService"
import type { Couple, Template, MediaAsset, Profile, Memory, TimelineEvent } from "../types/models"
import ProfileForm from "./components/ProfileForm"
import MemoryForm from "./components/MemoryForm"
import TimelineForm from "./components/TimelineForm"

export default function CoupleEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState("BASIC")
  const [templates, setTemplates] = useState<Template[]>([])
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([])
  
  const [formData, setFormData] = useState<Partial<Couple>>({
    person1Name: "", person2Name: "", slug: "", relationshipStart: "",
    heroTitle: "", description: "", finalMessage: "", templateId: "cinematic",
    status: "DRAFT", counterEnabled: true, counterStartDate: "",
    endingTitle: "", endingQuote: ""
  })

  // Sub-content
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [memories, setMemories] = useState<Memory[]>([])
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])

  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    setTemplates(coupleService.getTemplates())
    
    if (id && id !== "new") {
      const loadData = async () => {
        const existing = await coupleService.getCoupleById(id)
        if (existing) {
          setFormData(existing)
          setMediaAssets(await mediaService.getMediaForCouple(id))
          setProfiles(await contentService.getProfiles(id))
          setMemories(await contentService.getMemories(id))
          setTimelineEvents(await contentService.getTimelineEvents(id))
          setIsDirty(false)
        } else {
          navigate("/admin/couples")
        }
      }
      loadData()
    }
  }, [id, navigate])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setIsDirty(true)
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const generateSlug = () => {
    if (formData.person1Name && formData.person2Name) {
      if (formData.status === 'PUBLISHED' && !window.confirm('This couple is published. Changing the URL slug will break existing links. Are you sure?')) {
        return
      }
      const safe = `${formData.person1Name}-${formData.person2Name}`.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, slug: safe }))
      setIsDirty(true)
    }
  }

  const handleSaveDraft = async () => {
    try {
      if (id === "new") {
        const newCouple = await coupleService.createCouple({ ...formData, status: "DRAFT" })
        setIsDirty(false)
        navigate(`/admin/couples/${newCouple.id}`)
      } else {
        await coupleService.updateCouple(id!, formData)
        setIsDirty(false)
        alert("Draft saved!")
      }
    } catch (e: any) {
      alert("Error saving: " + e.message)
    }
  }

  // Basic Validation
  const validatePublishing = () => {
    const errors = []
    if (isDirty) errors.push("You have unsaved changes. Save draft first.")
    if (!formData.person1Name || !formData.person2Name) errors.push("Missing names")
    if (!formData.slug) errors.push("Missing unique URL slug")
    if (!formData.heroTitle) errors.push("Missing hero title")
    if (!formData.heroMediaId) errors.push("Missing hero media reference")
    if (!formData.templateId) errors.push("Missing template selection")
    if (formData.templateId !== 'cinematic') errors.push("Template not yet implemented for production")
    return errors
  }

  const handlePublish = async () => {
    const errors = validatePublishing()
    if (errors.length > 0) {
      alert("Cannot publish:\n- " + errors.join("\n- "))
      return
    }
    if (window.confirm(`Publish this website?\n\nIt will become publicly accessible at /c/${formData.slug}`)) {
      try {
        await coupleService.updateCouple(id!, { ...formData, status: "PUBLISHED", publishedAt: new Date().toISOString() })
        setFormData(prev => ({ ...prev, status: "PUBLISHED" }))
        alert("Website published successfully!")
      } catch (e: any) {
        alert("Error publishing: " + e.message)
      }
    }
  }

  const handleUnpublish = () => {
    if (window.confirm("Unpublish this website? It will no longer be publicly accessible.")) {
      coupleService.updateCouple(id!, { ...formData, status: "DRAFT" })
      setFormData(prev => ({ ...prev, status: "DRAFT" }))
    }
  }

  const handleArchive = () => {
    if (window.confirm("Archive this website? It will be deactivated permanently unless restored.")) {
      coupleService.updateCouple(id!, { ...formData, status: "ARCHIVED" })
      setFormData(prev => ({ ...prev, status: "ARCHIVED" }))
    }
  }

  if (id === "new" && activeTab !== "BASIC") {
    setActiveTab("BASIC") // Force basic tab for new couples
  }

  const tabs = [
    { id: "BASIC", label: "Basic Info" },
    { id: "HERO", label: "Hero" },
    { id: "PROFILES", label: "Profiles" },
    { id: "MEMORIES", label: "Memories" },
    { id: "TIMELINE", label: "Timeline" },
    { id: "AUDIO", label: "Audio & Final" },
    { id: "PUBLISHING", label: "Publishing" },
  ]

  // Renderers for different sections
  const renderBasic = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Person 1 Name</label>
          <input required type="text" name="person1Name" value={formData.person1Name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Person 2 Name</label>
          <input required type="text" name="person2Name" value={formData.person2Name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Unique URL Slug</label>
        <div className="flex gap-2">
          <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="flex-1 bg-gray-900 border border-gray-700 rounded p-3 text-white" />
          <button type="button" onClick={generateSlug} className="bg-gray-700 px-4 rounded text-sm hover:bg-gray-600 transition">Auto</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Relationship Start Date</label>
          <input required type="date" name="relationshipStart" value={formData.relationshipStart} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Template</label>
          <select name="templateId" value={formData.templateId} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white">
            {templates.map(t => <option key={t.id} value={t.id}>{t.name} (v{t.version}) {t.id !== 'cinematic' ? '- Coming Soon' : ''}</option>)}
          </select>
        </div>
      </div>
    </div>
  )

  const renderHero = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Hero Title</label>
        <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Hero Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Hero Background Media (IMAGE/VIDEO)</label>
        <select name="heroMediaId" value={formData.heroMediaId || ''} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white">
          <option value="">Select Media...</option>
          {mediaAssets.filter(m => m.type !== 'AUDIO').map(m => (
            <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-2">To upload new media, use the Media Library.</p>
      </div>
    </div>
  )

  const renderAudio = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-gray-400 mb-2">Background Audio Track</label>
        <select name="backgroundAudioMediaId" value={formData.backgroundAudioMediaId || ''} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white">
          <option value="">None</option>
          {mediaAssets.filter(m => m.type === 'AUDIO').map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>
      <div className="border-t border-gray-700 pt-6">
        <h4 className="text-lg font-bold mb-4">Final Message & Counter</h4>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input type="checkbox" name="counterEnabled" checked={formData.counterEnabled} onChange={handleChange} />
              Enable Relationship Counter
            </label>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Final Message / Quote</label>
            <input type="text" name="finalMessage" value={formData.finalMessage} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Ending Audio Track</label>
            <select name="endingAudioMediaId" value={formData.endingAudioMediaId || ''} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white">
              <option value="">None (Continue Background)</option>
              {mediaAssets.filter(m => m.type === 'AUDIO').map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const [editingProfile, setEditingProfile] = useState<Partial<Profile> | null>(null)
  const [editingMemory, setEditingMemory] = useState<Partial<Memory> | null>(null)
  const [editingTimeline, setEditingTimeline] = useState<Partial<TimelineEvent> | null>(null)

  const handleSaveProfile = async (data: Partial<Profile>) => {
    await contentService.saveProfile({ ...data, coupleId: id })
    setProfiles(await contentService.getProfiles(id!))
    setEditingProfile(null)
  }
  const handleDeleteProfile = async (itemId: string) => {
    if (!window.confirm("Delete this profile?")) return
    await contentService.deleteProfile(itemId)
    setProfiles(await contentService.getProfiles(id!))
  }

  const handleSaveMemory = async (data: Partial<Memory>) => {
    await contentService.saveMemory({ ...data, coupleId: id })
    setMemories(await contentService.getMemories(id!))
    setEditingMemory(null)
  }
  const handleDeleteMemory = async (itemId: string) => {
    if (!window.confirm("Delete this memory?")) return
    await contentService.deleteMemory(itemId)
    setMemories(await contentService.getMemories(id!))
  }

  const handleSaveTimeline = async (data: Partial<TimelineEvent>) => {
    await contentService.saveTimelineEvent({ ...data, coupleId: id })
    setTimelineEvents(await contentService.getTimelineEvents(id!))
    setEditingTimeline(null)
  }
  const handleDeleteTimeline = async (itemId: string) => {
    if (!window.confirm("Delete this event?")) return
    await contentService.deleteTimelineEvent(itemId)
    setTimelineEvents(await contentService.getTimelineEvents(id!))
  }

  const renderLists = (type: 'PROFILES' | 'MEMORIES' | 'TIMELINE') => {
    if (type === 'PROFILES') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">Manage profiles for the couple.</p>
            <button onClick={() => setEditingProfile({})} className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600">+ Add Profile</button>
          </div>
          {editingProfile && (
            <ProfileForm initialData={editingProfile.id ? editingProfile as Profile : undefined} mediaAssets={mediaAssets} onSave={handleSaveProfile} onCancel={() => setEditingProfile(null)} />
          )}
          <div className="space-y-2">
            {profiles.length === 0 ? <p className="text-gray-500">No profiles yet.</p> : profiles.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-700 rounded p-4 flex justify-between items-center">
                <span className="font-semibold text-white">{p.name}</span>
                <div className="space-x-3">
                  <button onClick={() => setEditingProfile(p)} className="text-blue-500 text-sm hover:text-blue-400">Edit</button>
                  <button onClick={() => handleDeleteProfile(p.id)} className="text-red-500 text-sm hover:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (type === 'MEMORIES') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">Manage memories.</p>
            <button onClick={() => setEditingMemory({})} className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600">+ Add Memory</button>
          </div>
          {editingMemory && (
            <MemoryForm initialData={editingMemory.id ? editingMemory as Memory : undefined} mediaAssets={mediaAssets} onSave={handleSaveMemory} onCancel={() => setEditingMemory(null)} />
          )}
          <div className="space-y-2">
            {memories.length === 0 ? <p className="text-gray-500">No memories yet.</p> : memories.map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-700 rounded p-4 flex justify-between items-center">
                <span className="font-semibold text-white">{m.title}</span>
                <div className="space-x-3">
                  <button onClick={() => setEditingMemory(m)} className="text-blue-500 text-sm hover:text-blue-400">Edit</button>
                  <button onClick={() => handleDeleteMemory(m.id)} className="text-red-500 text-sm hover:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (type === 'TIMELINE') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-400 text-sm">Manage timeline events.</p>
            <button onClick={() => setEditingTimeline({})} className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600">+ Add Event</button>
          </div>
          {editingTimeline && (
            <TimelineForm initialData={editingTimeline.id ? editingTimeline as TimelineEvent : undefined} mediaAssets={mediaAssets} onSave={handleSaveTimeline} onCancel={() => setEditingTimeline(null)} />
          )}
          <div className="space-y-2">
            {timelineEvents.length === 0 ? <p className="text-gray-500">No events yet.</p> : timelineEvents.map(e => (
              <div key={e.id} className="bg-gray-900 border border-gray-700 rounded p-4 flex justify-between items-center">
                <span className="font-semibold text-white">{e.title} <span className="text-gray-500 text-sm">({e.date})</span></span>
                <div className="space-x-3">
                  <button onClick={() => setEditingTimeline(e)} className="text-blue-500 text-sm hover:text-blue-400">Edit</button>
                  <button onClick={() => handleDeleteTimeline(e.id)} className="text-red-500 text-sm hover:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    return null
  }

  const renderPublishing = () => {
    return (
      <div className="space-y-8">
        <div className="bg-gray-900 p-6 rounded border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Current Status: <span className={formData.status === 'PUBLISHED' ? 'text-green-500' : formData.status === 'ARCHIVED' ? 'text-gray-500' : 'text-amber-500'}>{formData.status}</span></h3>
          <p className="text-gray-400 text-sm mb-6">
            {formData.status === 'PUBLISHED' ? 'This website is live.' : 'This website is not publicly accessible.'}
          </p>
          
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-300">Validation Checklist</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">{formData.person1Name && formData.person2Name ? '✅' : '❌'} Basic Information</li>
              <li className="flex items-center gap-2">{formData.slug ? '✅' : '❌'} Unique URL Slug</li>
              <li className="flex items-center gap-2">{formData.heroMediaId ? '✅' : '❌'} Hero Media Assigned</li>
              <li className="flex items-center gap-2">{formData.templateId === 'cinematic' ? '✅' : '❌'} Valid Template</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <a href={`/c/${formData.slug}`} target="_blank" rel="noreferrer" className="flex-1 bg-gray-800 text-center py-3 rounded font-bold hover:bg-gray-700 transition">
            Preview Website
          </a>
          {formData.status !== 'PUBLISHED' ? (
            <button onClick={handlePublish} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded font-bold transition">
              Publish
            </button>
          ) : (
            <button onClick={handleUnpublish} className="flex-1 bg-amber-600 hover:bg-amber-700 py-3 rounded font-bold transition">
              Unpublish
            </button>
          )}
          {formData.status !== 'ARCHIVED' && (
            <button onClick={handleArchive} className="px-6 bg-red-900/30 text-red-500 hover:bg-red-900/50 py-3 rounded font-bold transition">
              Archive
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-950">
      <header className="px-8 py-6 border-b border-gray-800 flex justify-between items-center bg-gray-900">
        <div>
          <button onClick={(e) => { if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) { e.preventDefault(); return; } navigate("/admin/couples") }} className="text-sm text-gray-400 hover:text-white transition">? Back to Couples</button>
          <h2 className="text-2xl font-bold mt-2">
            {id === "new" ? "Create Couple Website" : `${formData.person1Name || 'Unknown'} & ${formData.person2Name || 'Unknown'}`}
          </h2>
        </div>
        <div className="flex gap-4">
          {id !== 'new' && (
            <button 
              onClick={(e) => {
                if (isDirty && !window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                  e.preventDefault()
                  return
                }
                navigate(`/admin/couples/${id}/media`)
              }}
              className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded text-sm font-semibold transition"
            >
              Media Library
            </button>
          )}
          <button onClick={handleSaveDraft} className="bg-red-600 hover:bg-red-700 px-8 py-2 rounded font-bold transition shadow-lg shadow-red-900/20">
            Save Draft
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-gray-800 bg-gray-900/50 p-4 overflow-y-auto">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={id === 'new' && tab.id !== 'BASIC'}
                className={`w-full text-left px-4 py-3 rounded text-sm font-semibold transition-colors 
                  ${activeTab === tab.id ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'}
                  ${id === 'new' && tab.id !== 'BASIC' ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Editor Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-3xl">
            {activeTab === "BASIC" && renderBasic()}
            {activeTab === "HERO" && renderHero()}
            {activeTab === "AUDIO" && renderAudio()}
            {activeTab === "PUBLISHING" && renderPublishing()}
            {(activeTab === "PROFILES" || activeTab === "MEMORIES" || activeTab === "TIMELINE") && renderLists(activeTab as any)}
          </div>
        </main>
      </div>
    </div>
  )
}
