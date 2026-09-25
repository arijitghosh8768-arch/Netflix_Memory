import { useEffect, useState } from "react"
import { Link } from "react-router"
import { coupleService } from "../services/coupleService"
import type { Couple } from "../types/models"

export default function CouplesList() {
  const [couples, setCouples] = useState<Couple[]>([])

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    coupleService.getAllCouples().then(data => {
      setCouples(data)
      setIsLoading(false)
    }).catch(err => {
      console.error(err)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) return <div className="p-10 text-white">Loading couples...</div>

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Couples</h2>
        <Link 
          to="/admin/couples/new" 
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition"
        >
          Add New Couple
        </Link>
      </div>
      
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="p-4 font-semibold text-gray-400">Couple</th>
              <th className="p-4 font-semibold text-gray-400">Slug</th>
              <th className="p-4 font-semibold text-gray-400">Template</th>
              <th className="p-4 font-semibold text-gray-400">Status</th>
              <th className="p-4 font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couples.map((c) => (
              <tr key={c.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                <td className="p-4 font-medium">{c.person1Name} & {c.person2Name}</td>
                <td className="p-4 text-gray-400 text-sm">/c/{c.slug}</td>
                <td className="p-4 text-gray-400 text-sm">{c.templateId}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase tracking-wider
                    ${c.status === 'PUBLISHED' ? 'bg-emerald-500/20 text-emerald-400' : 
                      c.status === 'DRAFT' ? 'bg-amber-500/20 text-amber-400' : 
                      'bg-gray-600/20 text-gray-400'}
                  `}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 flex gap-3">
                  <Link 
                    to={`/admin/couples/${c.id}`} 
                    className="text-blue-400 hover:text-blue-300 transition text-sm"
                  >
                    Edit
                  </Link>
                  {c.status === 'PUBLISHED' && (
                    <a 
                      href={`/c/${c.slug}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white transition text-sm"
                    >
                      Preview
                    </a>
                  )}
                </td>
              </tr>
            ))}
            
            {couples.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No couples found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
