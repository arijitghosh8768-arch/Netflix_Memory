import { config } from "../data/config"
import { memories } from "../data/memories"
import { timeline } from "../data/timeline"

function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white p-8">
      <h1 className="text-4xl font-bold">
        {config.siteName}
      </h1>

      <p className="mt-4 text-gray-400">
        {config.hero.description}
      </p>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">
          Memories
        </h2>

        <p className="mt-2 text-gray-400">
          {memories.length} memories loaded
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">
          Timeline
        </h2>

        <p className="mt-2 text-gray-400">
          {timeline.length} events loaded
        </p>
      </div>
    </main>
  )
}

export default Home
