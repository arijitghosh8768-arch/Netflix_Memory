import { Link } from 'react-router'

function Profiles() {
  return (
    <main className="min-h-screen bg-[#080808] text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-semibold">
          Who's Watching?
        </h1>

        <Link
          to="/home"
          className="inline-block mt-6 px-5 py-3 bg-white text-black rounded-lg"
        >
          Select Profile
        </Link>
      </div>
    </main>
  )
}

export default Profiles
