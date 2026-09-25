import { useEffect, useState } from "react"
import { coupleService } from "../services/coupleService"
import type { Template } from "../types/models"

export default function TemplateSelector() {
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    setTemplates(coupleService.getTemplates())
  }, [])

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-8">Templates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map(t => (
          <div key={t.id} className={`p-6 rounded-xl border ${t.id === 'cinematic' ? 'bg-gray-800 border-red-500/50' : 'bg-gray-900 border-gray-800'} relative overflow-hidden`}>
            {t.id === 'cinematic' && (
              <div className="absolute top-0 right-0 bg-red-600 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-bl-lg">Active</div>
            )}
            <h3 className="text-xl font-bold text-white">{t.name}</h3>
            <p className="text-gray-400 text-sm mt-2 mb-4 h-10">{t.description}</p>
            <div className="text-xs text-gray-600 bg-gray-950 p-3 rounded-md">
              Version: {t.version}
              <br/>
              Features: {t.supportedFeatures.length ? t.supportedFeatures.join(", ") : "None yet"}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
