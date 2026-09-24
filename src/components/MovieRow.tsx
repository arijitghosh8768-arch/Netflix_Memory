import type { Memory } from "../data/memories"
import MovieCard from "./MovieCard"

export default function MovieRow({ title, memories }: { title: string, memories: Memory[] }) {
  if (!memories.length) return null

  // ponytail: pure CSS native scroll row (snap-x). No heavy carousel library needed.
  return (
    <div className="mb-8 md:mb-12 px-4 md:px-12">
      <h2 className="text-lg md:text-2xl font-semibold text-white mb-4 drop-shadow-sm">{title}</h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto snap-x scrollbar-hide pb-4 -mx-4 px-4 md:mx-0 md:px-0">
        {memories.map(memory => (
          <MovieCard key={memory.id} memory={memory} />
        ))}
      </div>
    </div>
  )
}
