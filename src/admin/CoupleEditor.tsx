import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import { coupleService } from "../services/coupleService"
import type { Couple, Template } from "../types/models"

export default function CoupleEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState<Partial<Couple>>({
    person1Name: "",
    person2Name: "",
    slug: "",
    relationshipStart: "",
    heroTitle: "",
    description: "",
    finalMessage: "",
    templateId: "cinematic",
    status: "DRAFT"
  })

  const [templates, setTemplates] = useState<Template[]>([])
  
  useEffect(() => {
    setTemplates(coupleService.getTemplates())
    
    if (id && id !== "new") {
      const existing = coupleService.getCoupleById(id)
      if (existing) {
        setFormData(existing)
      } else {
        navigate("/admin/couples")
      }
    }
  }, [id, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Basic auto-slug generation
  const generateSlug = () => {
    if (formData.person1Name && formData.person2Name) {
      const raw = `${formData.person1Name}-${formData.person2Name}`
      const safe = raw.toLowerCase().replace(/[^a-z0-9-]/g, '')
      setFormData(prev => ({ ...prev, slug: safe }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate reserved routes
    const reserved = ['admin', 'api', 'profiles', 'home', 'watch', 'credits', 'settings', 'templates']
    if (reserved.includes(formData.slug || '')) {
      alert("This slug is reserved. Please choose another.")
      return
    }

    if (id && id !== "new") {
      coupleService.updateCouple(id, formData)
    } else {
      const newCouple = coupleService.createCouple(formData)
      navigate(`/admin/couples/${newCouple.id}`)
      return
    }
    alert("Saved successfully!")
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8">
        {id === "new" ? "Create New Couple" : "Edit Couple"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-gray-800 p-8 rounded-xl border border-gray-700">
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Person 1 Name</label>
            <input required type="text" name="person1Name" value={formData.person1Name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Person 2 Name</label>
            <input required type="text" name="person2Name" value={formData.person2Name} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Unique URL Slug</label>
            <div className="flex gap-2">
              <input required type="text" name="slug" value={formData.slug} onChange={handleChange} className="flex-1 bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
              <button type="button" onClick={generateSlug} className="bg-gray-700 px-4 rounded-md text-sm hover:bg-gray-600 transition">Auto</button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Relationship Start Date</label>
            <input required type="date" name="relationshipStart" value={formData.relationshipStart} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Hero Title</label>
          <input required type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Description</label>
          <textarea required name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">Final Message</label>
          <input required type="text" name="finalMessage" value={formData.finalMessage} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Template</label>
            <select name="templateId" value={formData.templateId} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white">
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name} (v{t.version})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-white">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700 flex justify-end">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-bold transition">
            Save Couple
          </button>
        </div>
      </form>
      
      {id !== 'new' && (
        <div className="mt-8 p-6 bg-gray-800/50 rounded-xl border border-dashed border-gray-700 text-center flex flex-col items-center">
          <p className="text-gray-400 mb-4">Manage the photos, videos, and audio tracks for this couple.</p>
          <button 
            onClick={() => navigate(`/admin/couples/${id}/media`)}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded text-white font-semibold transition"
          >
            Open Media Library
          </button>
        </div>
      )}
    </div>
  )
}
