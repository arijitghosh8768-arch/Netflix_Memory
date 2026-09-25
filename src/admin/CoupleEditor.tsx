import { useEffect, useState } from "react"
import { useNavigate, useParams, Link } from "react-router"
import { coupleService, contentService } from "../services/coupleService"
import { mediaService } from "../services/mediaService"
import type { Couple, Template, MediaAsset, Profile, Memory, TimelineEvent } from "../types/models"

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
        } else {
          navigate("/admin/couples")
        }
      }
      loadData()
    }
  }, [id, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
      const safe = `${formData.person1Name}-${formData.person2Name}`.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, slug: safe }))
    }
  }

  const handleSaveDraft = async () => {
    try {
      if (id === "new") {
        const newCouple = await coupleService.createCouple({ ...formData, status: "DRAFT" })
        navigate(`/admin/couples/${newCouple.id}`)
      } else {
        await coupleService.updateCouple(id!, formData)
        alert("Draft saved!")
      }
    } catch (e: any) {
      alert("Error saving: " + e.message)
    }
  }

  // Basic Validation
  const validatePublishing = () => {
    const errors = []
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

  const renderLists = (type: 'PROFILES' | 'MEMORIES' | 'TIMELINE') => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400 text-sm">Manage {type.toLowerCase()} for the couple.</p>
        <button onClick={() => alert(`Creating ${type.toLowerCase()} will be implemented in the specific list editor.`)} className="bg-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-600">+ Add New</button>
      </div>
      <div className="bg-gray-900 border border-gray-700 rounded p-8 text-center">
        <p className="text-gray-500">List editors (add, edit, delete, reorder) for {type.toLowerCase()} are scaffolded in the contentService.</p>
        <p className="text-gray-600 text-xs mt-2">Total records: {type === 'PROFILES' ? profiles.length : type === 'MEMORIES' ? memories.length : timelineEvents.length}</p>
      </div>
    </div>
  )

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
          <Link to="/admin/couples" className="text-sm text-gray-400 hover:text-white transition">← Back to Couples</Link>
          <h2 className="text-2xl font-bold mt-2">
            {id === "new" ? "Create Couple Website" : `${formData.person1Name || 'Unknown'} & ${formData.person2Name || 'Unknown'}`}
          </h2>
        </div>
        <div className="flex gap-4">
          {id !== 'new' && (
            <Link to={`/admin/couples/${id}/media`} className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded text-sm font-semibold transition">
              Media Library
            </Link>
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
