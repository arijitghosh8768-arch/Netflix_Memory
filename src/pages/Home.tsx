import { Link } from 'react-router'

function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="p-8">
        <h1 className="text-4xl font-bold">
          OUR STORY
        </h1>

        <p className="mt-4 text-gray-400">
          Home page coming next.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/watch"
            className="px-5 py-3 bg-white text-black rounded-lg"
          >
            Play Story
          </Link>

          <Link
            to="/credits"
            className="px-5 py-3 border border-white/30 rounded-lg"
          >
            Credits
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Home
