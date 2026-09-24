import { Link } from 'react-router'

function NotFound() {
  return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold">
          404
        </h1>

        <p className="mt-4 text-gray-400">
          This page doesn't exist.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 px-5 py-3 rounded-lg bg-white text-black font-medium"
        >
          Go Home
        </Link>
      </div>
    </main>
  )
}

export default NotFound
