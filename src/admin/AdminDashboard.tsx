import { useEffect, useState } from "react"
import { coupleService } from "../services/coupleService"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, archived: 0 })

  useEffect(() => {
    const couples = coupleService.getAllCouples()
    setStats({
      total: couples.length,
      published: couples.filter((c) => c.status === "PUBLISHED").length,
      draft: couples.filter((c) => c.status === "DRAFT").length,
      archived: couples.filter((c) => c.status === "ARCHIVED").length,
    })
  }, [])

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Total Couples</p>
          <p className="text-4xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-emerald-500 text-sm font-semibold uppercase tracking-wider">Published</p>
          <p className="text-4xl font-bold mt-2">{stats.published}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider">Draft</p>
          <p className="text-4xl font-bold mt-2">{stats.draft}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Archived</p>
          <p className="text-4xl font-bold mt-2">{stats.archived}</p>
        </div>
      </div>
    </div>
  )
}
